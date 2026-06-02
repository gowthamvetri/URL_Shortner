import api from './api';

export const analyticsService = {
  getUrlAnalytics: async (urlId) => {
    const response = await api.get(`/analytics/${urlId}`);
    return response.data;
  },
  getGlobalAnalytics: async () => {
    const response = await api.get('/analytics/global');
    return response.data;
  }
};
