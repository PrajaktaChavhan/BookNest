import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A buyer should only ever have ONE conversation per listing - prevents
// duplicates if they click "message seller" more than once (Phase 8's
// idempotent POST /conversations decision relies on this constraint).
conversationSchema.index({ listing: 1, participants: 1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);