import { api } from './axiosInstance.js';

export const getUserProfile = (id) => api.get('/api/users/' + id);
export const updateProfile = (data) => api.patch('/api/users/me', data);
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.post('/api/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};