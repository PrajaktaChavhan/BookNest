import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as listingService from './listing.service.js';

export const create = catchAsync(async (req, res) => {
  const listing = await listingService.createListing(
    req.user._id,
    req.user.locality,
    req.body,
    req.files
  );
  return ApiResponse(res, 201, { listing }, 'Listing created');
});

export const search = catchAsync(async (req, res) => {
  const result = await listingService.searchListings(req.query);
  return ApiResponse(res, 200, result, 'Listings retrieved');
});

export const getById = catchAsync(async (req, res) => {
  const listing = await listingService.getListingById(req.params.id);
  return ApiResponse(res, 200, { listing }, 'Listing retrieved');
});

export const update = catchAsync(async (req, res) => {
  const listing = await listingService.updateListing(req.params.id, req.user._id, req.body);
  return ApiResponse(res, 200, { listing }, 'Listing updated');
});

export const updateStatus = catchAsync(async (req, res) => {
  const listing = await listingService.updateListingStatus(
    req.params.id,
    req.user._id,
    req.body.status
  );
  return ApiResponse(res, 200, { listing }, 'Listing status updated');
});

export const addImages = catchAsync(async (req, res) => {
  const listing = await listingService.addListingImages(req.params.id, req.user._id, req.files);
  return ApiResponse(res, 200, { listing }, 'Images added');
});

export const remove = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  await listingService.deleteListing(req.params.id, req.user._id, isAdmin);
  return ApiResponse(res, 200, null, 'Listing deleted');
});