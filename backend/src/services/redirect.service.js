import Url from '../models/Url.js';
import Visit from '../models/Visit.js';
import useragent from 'useragent';
import geoip from 'geoip-lite';
import redisClient from '../config/redis.js';

const CACHE_TTL_SECONDS = 86400; // 24 hours

const processRedirect = async (shortCode, req) => {
  const cacheKey = `url:${shortCode}`;
  let url = null;

  // 1. Try to get from Cache
  if (redisClient) {
    try {
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        // @upstash/redis parses JSON automatically if it was stored as JSON
        url = typeof cachedUrl === 'string' ? JSON.parse(cachedUrl) : cachedUrl;
      }
    } catch (err) {
      console.error('Redis GET error:', err);
    }
  }

  // 2. Find URL in DB if not in Cache
  if (!url) {
    url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
    }).lean();

    if (!url) {
      const error = new Error('URL not found');
      error.statusCode = 404;
      throw error;
    }

    // Set Cache
    if (redisClient) {
      try {
        await redisClient.set(cacheKey, url, { ex: CACHE_TTL_SECONDS });
      } catch (err) {
        console.error('Redis SET error:', err);
      }
    }
  }

  // 3. Validate Status and Expiry
  if (!url.isActive) {
    const error = new Error('URL is inactive');
    error.statusCode = 400;
    throw error;
  }

  if (url.expiryDate && new Date(url.expiryDate) < new Date()) {
    const error = new Error('URL has expired');
    error.statusCode = 400;
    throw error;
  }

  // 4. Update click count asynchronously (non-blocking)
  const newClickCount = (url.clickCount || 0) + 1;
  Url.updateOne({ _id: url._id }, { $inc: { clickCount: 1 } }).exec().catch(console.error);

  // 5. Record Visit (Asynchronously so it doesn't block redirection)
  recordVisit(url._id, req).catch(console.error);

  const referrer = req.headers.referer || req.headers.referrer || 'Direct';

  // 6. Emit live stat event via Socket.IO
  const io = req.app.get('io');
  if (io && url.userId) {
    io.to(url.userId.toString()).emit('linkClicked', {
      shortCode: url.shortCode,
      clickCount: newClickCount,
      timestamp: new Date().toISOString(),
      originalUrl: url.originalUrl,
      referrer: referrer
    });
  }

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
