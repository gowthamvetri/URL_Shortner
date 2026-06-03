import { nanoid  } from 'nanoid';
import QRCode from 'qrcode';
import dns from 'dns/promises';
import Url from '../models/Url.js';
import redisClient from '../config/redis.js';

async function validateDomainExistence(urlString) {
  try {
    const parsedUrl = new URL(urlString);
    const hostname = parsedUrl.hostname;

    if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.')) {
        return false;
    }

    await dns.lookup(hostname);
    return true;
  } catch (error) {
    return false;
  }
}

const createUrl = async (userId, originalUrl, customAlias, expiryDate) => {
  const isDomainValid = await validateDomainExistence(originalUrl);
  if (!isDomainValid) {
    const error = new Error('The destination domain does not exist or is unreachable.');
    error.statusCode = 400;
    throw error;
  }

  let shortCode = customAlias;

  if (customAlias) {
    // Check if alias is already taken
    const existing = await Url.findOne({ customAlias });
    if (existing) {
      const error = new Error('Custom alias is already in use');
      error.statusCode = 400;
      throw error;
    }
  } else {
    // Generate a unique 7-character code
    let isUnique = false;
    while (!isUnique) {
      shortCode = nanoid(7);
      const existing = await Url.findOne({ shortCode });
      if (!existing) isUnique = true;
    }
  }

  // Generate QR Code data URI
  const qrCode = await QRCode.toDataURL(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/${shortCode}` : `http://localhost:5000/${shortCode}`);

  const url = await Url.create({
    userId,
    originalUrl,
    shortCode,
    customAlias,
    qrCode,
    expiryDate,
  });

  return url;
};

const bulkCreateUrls = async (userId, payloads) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [],
    urls: []
  };

  for (let i = 0; i < payloads.length; i++) {
    const { originalUrl, customAlias, expiryDate } = payloads[i];
    try {
      const url = await createUrl(userId, originalUrl, customAlias, expiryDate);
      results.successful++;
      results.urls.push(url);
    } catch (err) {
      results.failed++;
      results.errors.push({
        index: i,
        originalUrl,
        error: err.message || 'Failed to create URL'
      });
    }
  }

  return results;
};

const getUserUrls = async (userId, page = 1, limit = 10, search = '') => {
  const query = { userId };
  
  if (search) {
    query.$or = [
      { originalUrl: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } },
      { customAlias: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const urls = await Url.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Url.countDocuments(query);

  return {
    urls,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalCount: total,
  };
};

const getUrlById = async (userId, urlId) => {
  const url = await Url.findOne({ _id: urlId, userId });
  if (!url) {
    const error = new Error('URL not found');
    error.statusCode = 404;
    throw error;
  }
  return url;
};

const updateUrl = async (userId, urlId, updates) => {
  const url = await Url.findOne({ _id: urlId, userId });
  if (!url) {
    const error = new Error('URL not found');
    error.statusCode = 404;
    throw error;
  }

  if (updates.originalUrl) {
    const isDomainValid = await validateDomainExistence(updates.originalUrl);
    if (!isDomainValid) {
      const error = new Error('The destination domain does not exist or is unreachable.');
      error.statusCode = 400;
      throw error;
    }
    url.originalUrl = updates.originalUrl;
  }
  if (updates.expiryDate !== undefined) url.expiryDate = updates.expiryDate;
  if (updates.isActive !== undefined) url.isActive = updates.isActive;

  await url.save();

  if (redisClient) {
    try {
      await redisClient.del(`url:${url.shortCode}`);
      if (url.customAlias) {
        await redisClient.del(`url:${url.customAlias}`);
      }
    } catch (err) {
      console.error('Redis cache invalidation error during update:', err);
    }
  }

  return url;
};

const deleteUrl = async (userId, urlId) => {
  const url = await Url.findOneAndDelete({ _id: urlId, userId });
  if (!url) {
    const error = new Error('URL not found');
    error.statusCode = 404;
    throw error;
  }
  if (redisClient) {
    try {
      await redisClient.del(`url:${url.shortCode}`);
      if (url.customAlias) {
        await redisClient.del(`url:${url.customAlias}`);
      }
    } catch (err) {
      console.error('Redis cache invalidation error during delete:', err);
    }
  }

  return true;
};

export {
  createUrl,
  bulkCreateUrls,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl
};
