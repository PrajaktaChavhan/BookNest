import { User } from '../users/user.model.js';
import { Listing } from '../listings/listing.model.js';
import { ApiError } from '../../utils/ApiError.js';

export async function listUsers({ q, page = 1, limit = 20 }) {
  const query = q ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] } : {};
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    User.find(query).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function setUserSuspension(userId, isSuspended) {
  const user = await User.findByIdAndUpdate(userId, { isSuspended }, { new: true }).select(
    '-passwordHash'
  );
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function listAllListings({ q, page = 1, limit = 20 }) {
  const query = q ? { title: new RegExp(q, 'i') } : {};
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Listing.find(query).populate('owner', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Listing.countDocuments(query),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function forceDeleteListing(listingId) {
  const listing = await Listing.findByIdAndDelete(listingId);
  if (!listing) throw ApiError.notFound('Listing not found');
  return listing;
}

/**
 * Analytics via MongoDB aggregation pipelines (Phase 7 note: this needs
 * real aggregation, not just simple find/count queries) - covers the
 * metrics named in our Phase 4 admin user story: total users, listings by
 * category/type, growth over time, most active localities.
 */
export async function getAnalytics() {
  const [totalUsers, totalListings, listingsByCategory, listingsByType, usersByMonth, topLocalities] =
    await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),

      Listing.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),

      Listing.aggregate([{ $group: { _id: '$listingType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),

      // User growth over time - grouped by year-month.
      User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Most active localities by listing count.
      Listing.aggregate([
        { $group: { _id: '$locality', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

  return {
    totalUsers,
    totalListings,
    listingsByCategory,
    listingsByType,
    usersByMonth,
    topLocalities,
  };
}