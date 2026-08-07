import { api } from './axiosInstance.js';

export const getUsers = (params) => api.get('/api/admin/users', { params });
export const setUserSuspension = (id, isSuspended) =>
  api.patch('/api/admin/users/' + id + '/suspend', { isSuspended });

export const getAllListings = (params) => api.get('/api/admin/listings', { params });
export const deleteListingAsAdmin = (id) => api.delete('/api/admin/listings/' + id);

export const getReports = () => api.get('/api/admin/reports');
export const resolveReport = (id) => api.patch('/api/admin/reports/' + id + '/resolve');

export const getAnalytics = () => api.get('/api/admin/analytics');