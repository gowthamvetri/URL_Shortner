import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  requestPasswordChangeOTP: async () => {
    const response = await api.post('/auth/request-password-change-otp');
    return response.data;
  },

  changePassword: async (otpCode, newPassword) => {
    const response = await api.post('/auth/change-password', { otpCode, newPassword });
    return response.data;
  },

  verifyEmail: async (code) => {
    const response = await api.post('/auth/verify-email', { code });
    return response.data;
  },

  resendVerification: async () => {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  }
};
