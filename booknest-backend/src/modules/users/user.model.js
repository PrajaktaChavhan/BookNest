import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },

    profilePicture: { type: String, default: null },

    // Optional - not every user is a student (Persona 4, Phase 3)
    college: { type: String, default: null },
    department: { type: String, default: null },
    semester: { type: Number, default: null },

    locality: { type: String, required: true, index: true },
    whatsappNumber: { type: String, required: true },
    bio: { type: String, default: '' },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Denormalized cache - see Phase 7 trade-off rationale.
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    isSuspended: { type: Boolean, default: false },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
