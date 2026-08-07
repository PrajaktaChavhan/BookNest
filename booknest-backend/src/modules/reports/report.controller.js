import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as reportService from './report.service.js';

export const create = catchAsync(async (req, res) => {
  const report = await reportService.createReport(req.user._id, req.body);
  return ApiResponse(res, 201, { report }, 'Report submitted - our team will review it');
});