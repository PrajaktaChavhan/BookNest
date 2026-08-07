import { Rating } from './rating.model.js';
import { Listing } from '../listings/listing.model.js';
import { Conversation } from '../chat/conversation.model.js';
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { notify } from '../notifications/notification.service.js';

/**
 * The eligibility rule from Phase 4: a rating can only be submitted once
 * a listing is marked Sold (our schema uses "Sold" generically for
 * sold/rented/donated/exchanged - see Phase 7 note), AND the rater must
 * have actually been a participant in a conversation with the person
 * they're rating, about that specific listing. This stops drive-by or
 * fake reviews between people who never actually transacted.
 */
async function assertEligibleToRate(raterId, ratedUserId, listingId) {
  if (raterId.toString() === ratedUserId.toString()) {
    throw ApiError.badRequest('You cannot rate yourself');
  }

  const listing = await Listing.findById(listingId);
  if (!listing) throw ApiError.notFound('Listing not found');
  if (listing.status !== 'Sold') {
    throw ApiError.badRequest(
      'This listing has not been marked as completed yet',
      'TRANSACTION_NOT_COMPLETE'
    );
  }

  const conversation = await Conversation.findOne({
    listing: listingId,
    participants: { $all: [raterId, ratedUserId] },
  });
  if (!conversation) {
    throw ApiError.forbidden(
      'You can only rate someone you actually transacted with on this listing'
    );
  }
}

async function recalculateAverageRating(userId) {
  const stats = await Rating.aggregate([
    { $match: { ratedUser: userId } },
    { $group: { _id: '$ratedUser', avg: { $avg: '$score' }, count: { $sum: 1 } } },
  ]);

  const { avg = 0, count = 0 } = stats[0] || {};

  // Denormalized cache update (Phase 7 trade-off) - recalculated on every
  // new rating rather than computed live on every profile view.
  await User.findByIdAndUpdate(userId, {
    averageRating: Math.round(avg * 10) / 10, // one decimal place
    ratingCount: count,
  });
}

export async function createRating(raterId, { listingId, ratedUserId, score, comment }) {
  await assertEligibleToRate(raterId, ratedUserId, listingId);

  let rating;
  try {
    rating = await Rating.create({
      ratedUser: ratedUserId,
      ratedBy: raterId,
      listing: listingId,
      score,
      comment,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict('You have already rated this transaction', 'ALREADY_RATED');
    }
    throw err;
  }

  await recalculateAverageRating(ratedUserId);

  await notify(ratedUserId, 'new_rating', {
    ratingId: rating._id,
    listingId,
    score,
  });

  return rating;
}

export async function respondToRating(ratingId, userId, response) {
  const rating = await Rating.findById(ratingId);
  if (!rating) throw ApiError.notFound('Rating not found');
  if (rating.ratedUser.toString() !== userId.toString()) {
    throw ApiError.forbidden('Only the person who was rated can respond');
  }

  rating.response = response;
  await rating.save();
  return rating;
}

export async function getRatingsForUser(userId) {
  return Rating.find({ ratedUser: userId })
    .sort({ createdAt: -1 })
    .populate('ratedBy', 'name profilePicture')
    .populate('listing', 'title');
}