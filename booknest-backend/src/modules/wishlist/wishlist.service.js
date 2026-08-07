import { WishlistItem } from './wishlist.model.js';
import { Listing } from '../listings/listing.model.js';
import { ApiError } from '../../utils/ApiError.js';

export async function addToWishlist(userId, listingId) {
  const listing = await Listing.findById(listingId);
  if (!listing) throw ApiError.notFound('Listing not found');

  try {
    const item = await WishlistItem.create({ user: userId, listing: listingId });
    return item;
  } catch (err) {
    // MongoDB duplicate key error code - thrown by our unique compound index.
    if (err.code === 11000) {
      throw ApiError.conflict('Already in your wishlist', 'ALREADY_WISHLISTED');
    }
    throw err;
  }
}

export async function removeFromWishlist(userId, listingId) {
  const result = await WishlistItem.findOneAndDelete({ user: userId, listing: listingId });
  if (!result) throw ApiError.notFound('This listing is not in your wishlist');
}

export async function getWishlist(userId) {
  const items = await WishlistItem.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'listing',
      populate: { path: 'owner', select: 'name averageRating ratingCount' },
    });

  // A wishlisted listing may have since been deleted by its owner - filter
  // those out rather than showing a broken/null entry to the user.
  return items.filter((item) => item.listing !== null);
}
