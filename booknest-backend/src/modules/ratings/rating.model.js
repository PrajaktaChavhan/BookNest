import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    ratedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },

    score: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
    response: { type: String, default: null }, // ratedUser's reply to the review
  },
  { timestamps: true }
);

// Database-level guarantee that the same person can't rate the same
// transaction twice - a second line of defense beyond the app-level check
// in rating.service.js (per Phase 7's data-integrity trade-off discussion).
ratingSchema.index({ ratedBy: 1, listing: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);