import { api } from './axiosInstance.js';

export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);
export const logoutUser = () => api.post('/api/auth/logout');
export const getCurrentUser = () => api.get('/api/auth/me');
export const forgotPassword = (email) => api.post('/api/auth/forgot-password', { email });
export const resetPassword = (token, password) =>
  api.post(`/api/auth/reset-password/${token}`, { password });
