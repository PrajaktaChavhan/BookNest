import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as requestService from './request.service.js';

export const create = catchAsync(async (req, res) => {
  const request = await requestService.createRequest(req.user._id, req.user.locality, req.body);
  return ApiResponse(res, 201, { request }, 'Request posted');
});

export const browse = catchAsync(async (req, res) => {
  const result = await requestService.browseRequests(req.query);
  return ApiResponse(res, 200, result, 'Requests retrieved');
});

export const fulfill = catchAsync(async (req, res) => {
  const request = await requestService.fulfillRequest(req.params.id, req.user._id);
  return ApiResponse(res, 200, { request }, 'Request marked as fulfilled');
});

export const remove = catchAsync(async (req, res) => {
  await requestService.deleteRequest(req.params.id, req.user._id);
  return ApiResponse(res, 200, null, 'Request removed');
});