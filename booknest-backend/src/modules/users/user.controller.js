import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as userService from './user.service.js';

export const getById = catchAsync(async (req, res) => {
  const user = await userService.getPublicProfile(req.params.id);
  return ApiResponse(res, 200, { user }, 'Profile retrieved');
});

export const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  return ApiResponse(res, 200, { user }, 'Profile updated');
});

export const uploadMyAvatar = catchAsync(async (req, res) => {
  const user = await userService.updateAvatar(req.user._id, req.file);
  return ApiResponse(res, 200, { user }, 'Avatar updated');
});