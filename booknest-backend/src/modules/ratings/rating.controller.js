import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as ratingService from './rating.service.js';

export const create = catchAsync(async (req, res) => {
  const rating = await ratingService.createRating(req.user._id, req.body);
  return ApiResponse(res, 201, { rating }, 'Rating submitted');
});

export const respond = catchAsync(async (req, res) => {
  const rating = await ratingService.respondToRating(req.params.id, req.user._id, req.body.response);
  return ApiResponse(res, 200, { rating }, 'Response added');
});

export const getForUser = catchAsync(async (req, res) => {
  const ratings = await ratingService.getRatingsForUser(req.params.userId);
  return ApiResponse(res, 200, { ratings }, 'Ratings retrieved');
});