import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Supports cursor-based pagination ("messages before this one") - per our
// Phase 8 decision, chat uses cursor pagination instead of offset/page
// numbers, since new messages arriving mid-scroll would otherwise shift
// page boundaries and cause skipped or duplicated messages.
messageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
