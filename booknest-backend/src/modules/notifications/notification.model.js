import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['new_message', 'request_match', 'new_rating', 'listing_reserved'],
      required: true,
    },
    // Deliberately flexible (Phase 7 decision) - shape depends on `type`,
    // e.g. { conversationId } for new_message, { listingId, requestId } for
    // request_match. Leaning into MongoDB's schema flexibility here rather
    // than forcing every notification type into one rigid shape.
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
