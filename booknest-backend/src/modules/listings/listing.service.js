import { Listing } from './listing.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { uploadImages, deleteImages } from '../../utils/cloudinaryHelpers.js';
import { checkForMatchingRequests } from '../requests/request.service.js';
import { WishlistItem } from '../wishlist/wishlist.model.js';
import { notify } from '../notifications/notification.service.js';

export async function createListing(userId, userLocality, data, files) {
  const images = files?.length ? await uploadImages(files) : [];

  const listing = await Listing.create({
    ...data,
    owner: userId,
    locality: userLocality,
    images,
  });

  // Detection runs now (M1); actual notification delivery to the requester
  // is wired up once the Notifications module ships (M4), per our Phase 4
  // decision - this just records the match so M4 has a ready feed to consume.
  await checkForMatchingRequests(listing);

  return listing;
}

export async function searchListings(filters) {
  const {
    q, category, department, semester, condition,
    listingType, locality, priceMin, priceMax, page, limit,
    owner, status,
  } = filters;

  // Public search defaults to Available only (unchanged behavior). Only
  // when an `owner` filter is present (i.e. "my own listings") do we allow
  // seeing Reserved/Sold too - a user managing their own listing history
  // needs the full picture, not just what's live.
  const query = owner ? { owner } : { status: 'Available' };
  if (owner && status) query.status = status;

  if (category) query.category = category;
  if (department) query.department = department;
  if (semester) query.semester = semester;
  if (condition) query.condition = condition;
  if (listingType) query.listingType = listingType;
  if (locality) query.locality = locality;

  if (priceMin !== undefined || priceMax !== undefined) {
    query.price = {};
    if (priceMin !== undefined) query.price.$gte = priceMin;
    if (priceMax !== undefined) query.price.$lte = priceMax;
  }

  if (q) {
    query.$text = { $search: q };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Listing.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('owner', 'name averageRating ratingCount'),
    Listing.countDocuments(query),
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getListingById(id) {
  const listing = await Listing.findById(id).populate(
    'owner',
    'name averageRating ratingCount whatsappNumber locality'
  );
  if (!listing) throw ApiError.notFound('Listing not found');
  return listing;
}

async function assertOwnership(listing, userId) {
  if (listing.owner.toString() !== userId.toString()) {
    throw ApiError.forbidden('You do not own this listing');
  }
}

export async function updateListing(id, userId, updates) {
  const listing = await Listing.findById(id);
  if (!listing) throw ApiError.notFound('Listing not found');
  await assertOwnership(listing, userId);

  Object.assign(listing, updates);
  await listing.save(); // .save() (not findByIdAndUpdate) so schema validators re-run
  return listing;
}

export async function updateListingStatus(id, userId, status) {
  const listing = await Listing.findById(id);
  if (!listing) throw ApiError.notFound('Listing not found');
  await assertOwnership(listing, userId);

  listing.status = status;
  await listing.save();

  // Alert anyone who wishlisted this listing that it's no longer freely
  // available - per the Phase 4 user story ("don't lose out on it").
  if (status !== 'Available') {
    const wishlisters = await WishlistItem.find({ listing: id }).select('user');
    await Promise.all(
      wishlisters.map((w) => notify(w.user, 'listing_reserved', { listingId: id, status }))
    );
  }

  return listing;
}

export async function addListingImages(id, userId, files) {
  const listing = await Listing.findById(id);
  if (!listing) throw ApiError.notFound('Listing not found');
  await assertOwnership(listing, userId);

  if (listing.images.length + files.length > 5) {
    throw ApiError.badRequest('A listing can have a maximum of 5 images');
  }

  const uploaded = await uploadImages(files);
  listing.images.push(...uploaded);
  await listing.save();
  return listing;
}

export async function deleteListing(id, userId, isAdmin = false) {
  const listing = await Listing.findById(id);
  if (!listing) throw ApiError.notFound('Listing not found');
  if (!isAdmin) await assertOwnership(listing, userId);

  await deleteImages(listing.images);
  await listing.deleteOne();
}