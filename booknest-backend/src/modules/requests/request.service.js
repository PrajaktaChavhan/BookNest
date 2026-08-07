import { BookRequest } from './request.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { notify } from '../notifications/notification.service.js';

// Lazy expiry (per Phase 8 decision - no cron job for V1). Called before any
// read of "Open" requests so stale ones don't linger in results without us
// needing a scheduled background job.
async function expireStaleRequests() {
  await BookRequest.updateMany(
    { status: 'Open', expiresAt: { $lt: new Date() } },
    { $set: { status: 'Expired' } }
  );
}

export async function createRequest(userId, userLocality, data) {
  const request = await BookRequest.create({
    ...data,
    requester: userId,
    locality: userLocality,
  });
  return request;
}

export async function browseRequests(filters) {
  await expireStaleRequests();

  const { q, category, locality, page, limit } = filters;
  const query = { status: 'Open' };

  if (category) query.category = category;
  if (locality) query.locality = locality;
  if (q) query.$text = { $search: q };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    BookRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('requester', 'name locality'),
    BookRequest.countDocuments(query),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function fulfillRequest(id, userId) {
  const request = await BookRequest.findById(id);
  if (!request) throw ApiError.notFound('Request not found');
  if (request.requester.toString() !== userId.toString()) {
    throw ApiError.forbidden('You do not own this request');
  }

  request.status = 'Fulfilled';
  await request.save();
  return request;
}

export async function deleteRequest(id, userId) {
  const request = await BookRequest.findById(id);
  if (!request) throw ApiError.notFound('Request not found');
  if (request.requester.toString() !== userId.toString()) {
    throw ApiError.forbidden('You do not own this request');
  }
  await request.deleteOne();
}

/**
 * Called from listing.service.js whenever a new listing is created.
 * Detection only - per our Phase 4 decision, actual notification DELIVERY
 * is deferred until the Notifications module ships (M4). For now, matches
 * are simply recorded on the BookRequest document via matchedListingId,
 * so M4 can start consuming an already-populated feed instead of having
 * to backfill/re-scan historical requests.
 */
export async function checkForMatchingRequests(listing) {
  const candidateQuery = {
    status: 'Open',
    matchedListingId: null, // don't overwrite an existing match
    locality: listing.locality,
    $or: [
      ...(listing.isbn ? [{ isbn: listing.isbn }] : []),
      { $text: { $search: `${listing.title} ${listing.author}` } },
    ],
  };

  const matches = await BookRequest.find(candidateQuery);
  if (matches.length === 0) return [];

  await BookRequest.updateMany(
    { _id: { $in: matches.map((m) => m._id) } },
    { $set: { matchedListingId: listing._id } }
  );

  // Delivery, now that the Notifications module exists (M4) - the detection
  // logic above hasn't changed at all, exactly as planned back in Phase 4.
  await Promise.all(
    matches.map((match) =>
      notify(match.requester, 'request_match', {
        requestId: match._id,
        listingId: listing._id,
        title: listing.title,
      })
    )
  );

  return matches;
}