import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as wishlistService from './wishlist.service.js';

export const getMyWishlist = catchAsync(async (req, res) => {
  const items = await wishlistService.getWishlist(req.user._id);
  return ApiResponse(res, 200, { items }, 'Wishlist retrieved');
});

export const add = catchAsync(async (req, res) => {
  const item = await wishlistService.addToWishlist(req.user._id, req.params.listingId);
  return ApiResponse(res, 201, { item }, 'Added to wishlist');
});

export const remove = catchAsync(async (req, res) => {
  await wishlistService.removeFromWishlist(req.user._id, req.params.listingId);
  return ApiResponse(res, 200, null, 'Removed from wishlist');
});