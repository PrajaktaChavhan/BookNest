import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['Listing', 'User'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open', index: true },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);