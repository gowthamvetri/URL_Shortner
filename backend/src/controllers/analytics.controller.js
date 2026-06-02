import * as analyticsService from '../services/analytics.service.js';

const getAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;
    const analyticsData = await analyticsService.getUrlAnalytics(req.user.id, urlId);
    
    return res.status(200).json(analyticsData);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

export {
  getAnalytics
};
