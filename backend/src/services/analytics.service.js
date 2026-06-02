import mongoose from 'mongoose';
import Url from '../models/Url.js';
import Visit from '../models/Visit.js';

const getUrlAnalytics = async (userId, urlId) => {
  // 1. Verify URL ownership
  const url = await Url.findOne({ _id: urlId, userId });
  if (!url) {
    const error = new Error('URL not found');
    error.statusCode = 404;
    throw error;
  }

  const objectId = new mongoose.Types.ObjectId(urlId);

  // 2. Fetch Recent Visits
  const recentVisits = await Visit.find({ urlId })
    .sort({ timestamp: -1 })
    .limit(1000);

  // 3. Aggregations for charts
  const [
    deviceStats,
    osStats,
    browserStats,
    countryStats,
    referrerStats,
    clicksOverTime
  ] = await Promise.all([
    getGroupedStats(objectId, '$device'),
    getGroupedStats(objectId, '$operatingSystem'),
    getGroupedStats(objectId, '$browser'),
    getGroupedStats(objectId, '$country'),
    getGroupedStats(objectId, '$referrer'),
    getClicksOverTime(objectId),
  ]);

  // Calculate Summary Stats
  const totalVisits = url.clickCount;
  const lastVisit = recentVisits.length > 0 ? recentVisits[0].timestamp : null;

  return {
    url: {
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      customAlias: url.customAlias,
      createdAt: url.createdAt,
      qrCode: url.qrCode,
    },
    summary: {
      totalClicks: totalVisits,
      lastVisit,
    },
    recentVisits,
    charts: {
      device: deviceStats,
      os: osStats,
      browser: browserStats,
      country: countryStats,
      referrer: referrerStats,
      timeline: clicksOverTime,
    }
  };
};

const getGroupedStats = async (urlId, groupByField) => {
  return Visit.aggregate([
    { $match: { urlId } },
    { $group: { _id: groupByField, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { name: '$_id', count: 1, _id: 0 } }
  ]);
};

const getClicksOverTime = async (urlId) => {
  // Return clicks grouped by day for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const data = await Visit.aggregate([
    { $match: { urlId, timestamp: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
        },
        clicks: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', clicks: 1, _id: 0 } }
  ]);

  return data;
};

const getGlobalAnalytics = async (userId) => {
  // 1. Get all URLs for the user
  const urls = await Url.find({ userId });
  const urlIds = urls.map(url => url._id);

  if (urlIds.length === 0) {
    return {
      topUrl: null,
      summary: { totalClicks: 0, trend: 0 },
      charts: {
        country: [],
        referrer: [],
        timeline: []
      }
    };
  }

  // 2. Calculate Total Clicks
  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);

  // 3. Find the Top URL
  const topUrl = urls.reduce((prev, current) => {
    return (prev.clickCount > current.clickCount) ? prev : current;
  }, urls[0]);

  // 4. Calculate trend (last 7 days vs previous 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [currentPeriodClicks, previousPeriodClicks] = await Promise.all([
    Visit.countDocuments({ urlId: { $in: urlIds }, timestamp: { $gte: sevenDaysAgo } }),
    Visit.countDocuments({ urlId: { $in: urlIds }, timestamp: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } })
  ]);

  let trend = 0;
  if (previousPeriodClicks > 0) {
    trend = Math.round(((currentPeriodClicks - previousPeriodClicks) / previousPeriodClicks) * 100);
  } else if (currentPeriodClicks > 0) {
    trend = 100; // 100% increase if previous was 0
  }

  // 5. Global Aggregations (Top Locations, Referrers, Timeline)
  const [
    countryStats,
    referrerStats,
    clicksOverTime
  ] = await Promise.all([
    Visit.aggregate([
      { $match: { urlId: { $in: urlIds } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]),
    Visit.aggregate([
      { $match: { urlId: { $in: urlIds } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]),
    Visit.aggregate([
      { $match: { urlId: { $in: urlIds }, timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', clicks: 1, _id: 0 } }
    ])
  ]);

  return {
    topUrl: topUrl ? {
      originalUrl: topUrl.originalUrl,
      shortCode: topUrl.shortCode,
      isActive: topUrl.isActive,
    } : null,
    summary: {
      totalClicks,
      trend,
    },
    charts: {
      country: countryStats,
      referrer: referrerStats,
      timeline: clicksOverTime,
    }
  };
};

export {
  getUrlAnalytics,
  getGlobalAnalytics,
  getGroupedStats,
  getClicksOverTime
};
