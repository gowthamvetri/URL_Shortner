import Url from '../models/Url.js';
import Visit from '../models/Visit.js';
import useragent from 'useragent';
import geoip from 'geoip-lite';

const processRedirect = async (shortCode, req) => {
  // 1. Find URL
  const url = await Url.findOne({
    $or: [{ shortCode }, { customAlias: shortCode }],
  });

  if (!url) {
    const error = new Error('URL not found');
    error.statusCode = 404;
    throw error;
  }

  if (!url.isActive) {
    const error = new Error('URL is inactive');
    error.statusCode = 400;
    throw error;
  }

  // 2. Check Expiry
  if (url.expiryDate && new Date(url.expiryDate) < new Date()) {
    const error = new Error('URL has expired');
    error.statusCode = 400;
    throw error;
  }

  // 3. Update click count
  url.clickCount += 1;
  await url.save();

  // 4. Record Visit (Asynchronously so it doesn't block redirection)
  recordVisit(url._id, req).catch(console.error);

  return url.originalUrl;
};

const recordVisit = async (urlId, req) => {
  // Parse user agent
  const agent = useragent.parse(req.headers['user-agent']);
  const browser = agent.family;
  const operatingSystem = agent.os.family;
  const device = agent.device.family === 'Other' ? 'Desktop' : agent.device.family;

  // Get IP and Geo Location
  // Standard approach for getting real IP behind proxies (like Nginx/Load Balancers)
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let country = 'Unknown';
  let city = 'Unknown';

  if (ipAddress) {
    // geoip-lite expects a clean IP address string
    const cleanIp = ipAddress.split(',')[0].trim();
    const geo = geoip.lookup(cleanIp);
    if (geo) {
      country = geo.country;
      city = geo.city;
    }
  }

  const referrer = req.headers.referer || req.headers.referrer || 'Direct';

  await Visit.create({
    urlId,
    browser,
    device,
    operatingSystem,
    ipAddress: ipAddress || 'Unknown',
    country,
    city,
    referrer,
  });
};

export {
  processRedirect,
  recordVisit
};
