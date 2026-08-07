import mongoose from 'mongoose';
import { CATEGORIES } from '../listings/listing.model.js';

const REQUEST_LIFESPAN_DAYS = 90; // per Phase 4 acceptance criteria

const bookRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true }, // optional - requester may not remember the author
    isbn: { type: String, trim: true, index: { sparse: true } },
    category: { type: String, enum: CATEGORIES },

    notes: { type: String, default: '' }, // e.g. "any edition fine, willing to rent too"

    status: { type: String, enum: ['Open', 'Fulfilled', 'Expired'], default: 'Open', index: true },

    // Set by the match-detection logic when a new listing matches this request.
    // Not auto-fulfilled - the requester still confirms via chat and marks
    // Fulfilled themselves (per Phase 4 user story).
    matchedListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', default: null },

    locality: { type: String, required: true, index: true },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + REQUEST_LIFESPAN_DAYS * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

bookRequestSchema.index({ title: 'text', author: 'text' });

export const BookRequest = mongoose.model('BookRequest', bookRequestSchema);