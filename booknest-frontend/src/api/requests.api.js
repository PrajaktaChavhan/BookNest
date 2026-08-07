import { api } from './axiosInstance.js';

export const browseRequests = (params) => api.get('/api/requests', { params });
export const createRequest = (data) => api.post('/api/requests', data);
export const fulfillRequest = (id) => api.patch('/api/requests/' + id + '/fulfill');
export const deleteRequest = (id) => api.delete('/api/requests/' + id);