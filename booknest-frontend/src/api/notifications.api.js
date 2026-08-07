import { api } from './axiosInstance.js';

export const getNotifications = () => api.get('/api/notifications');
export const markNotificationRead = (id) => api.patch('/api/notifications/' + id + '/read');
export const markAllNotificationsRead = () => api.patch('/api/notifications/read-all');