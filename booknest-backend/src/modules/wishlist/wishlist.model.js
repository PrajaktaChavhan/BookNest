import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  },
  { timestamps: true }
);

// Prevents the same user saving the same listing twice - enforced at the
// database level, not just in application logic (same pattern as the
// Rating uniqueness constraint from Phase 7).
wishlistItemSchema.index({ user: 1, listing: 1 }, { unique: true });

export const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);