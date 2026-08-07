import { api } from './axiosInstance.js';

export const listConversations = () => api.get('/api/conversations');
export const getMessages = (conversationId, params) =>
  api.get('/api/conversations/' + conversationId + '/messages', { params });
