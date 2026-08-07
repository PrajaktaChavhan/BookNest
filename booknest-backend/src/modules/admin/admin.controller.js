import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as adminService from './admin.service.js';
import * as reportService from '../reports/report.service.js';

export const getUsers = catchAsync(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  return ApiResponse(res, 200, result, 'Users retrieved');
});

export const updateUserSuspension = catchAsync(async (req, res) => {
  const user = await adminService.setUserSuspension(req.params.id, req.body.isSuspended);
  return ApiResponse(res, 200, { user }, user.isSuspended ? 'User suspended' : 'User unsuspended');
});

export const getListings = catchAsync(async (req, res) => {
  const result = await adminService.listAllListings(req.query);
  return ApiResponse(res, 200, result, 'Listings retrieved');
});

export const deleteListing = catchAsync(async (req, res) => {
  await adminService.forceDeleteListing(req.params.id);
  return ApiResponse(res, 200, null, 'Listing removed');
});

export const getReports = catchAsync(async (req, res) => {
  const reports = await reportService.getOpenReports();
  return ApiResponse(res, 200, { reports }, 'Open reports retrieved');
});

export const resolveReport = catchAsync(async (req, res) => {
  const report = await reportService.resolveReport(req.params.id);
  return ApiResponse(res, 200, { report }, 'Report resolved');
});

export const getAnalytics = catchAsync(async (req, res) => {
  const analytics = await adminService.getAnalytics();
  return ApiResponse(res, 200, { analytics }, 'Analytics retrieved');
});