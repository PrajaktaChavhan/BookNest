import { api } from './axiosInstance.js';

export const getRatingsForUser = (userId) => api.get('/api/ratings/user/' + userId);