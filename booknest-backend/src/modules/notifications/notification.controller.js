import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as notificationService from './notification.service.js';

export const list = catchAsync(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(req.user._id);
  return ApiResponse(res, 200, { notifications }, 'Notifications retrieved');
});

export const markRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  return ApiResponse(res, 200, { notification }, 'Marked as read');
});

export const markAllRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  return ApiResponse(res, 200, null, 'All notifications marked as read');
});