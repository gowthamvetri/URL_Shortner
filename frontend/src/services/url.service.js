import api from './api';

export const urlService = {
  createUrl: async (data) => {
    const response = await api.post('/urls', data);
    return response.data;
  },

  bulkCreateUrls: async (urls) => {
    const response = await api.post('/urls/bulk', { urls });
    return response.data;
  },
  
  getUrls: async (page = 1, limit = 10, search = '') => {
    const response = await api.get(`/urls?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },

  getUrlById: async (id) => {
    const response = await api.get(`/urls/${id}`);
    return response.data;
  },

  updateUrl: async (id, data) => {
    const response = await api.put(`/urls/${id}`, data);
    return response.data;
  },

  deleteUrl: async (id) => {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  },
};
