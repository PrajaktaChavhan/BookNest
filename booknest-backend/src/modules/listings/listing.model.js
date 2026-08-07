import mongoose from 'mongoose';

const CATEGORIES = [
  'Academic',
  'Competitive Exam',
  'Fiction',
  'Non-Fiction',
  'Comics',
  'Biography',
  "Children's",
  'Other',
];

const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true, index: { sparse: true } }, // sparse - many books won't have one

    category: { type: String, enum: CATEGORIES, required: true },

    // Conditionally required - only meaningful when category === 'Academic'.
    // Enforced below via a custom validator, not left silently optional.
    department: {
      type: String,
      required: function () {
        return this.category === 'Academic';
      },
    },
    semester: {
      type: Number,
      min: 1,
      max: 12,
      required: function () {
        return this.category === 'Academic';
      },
    },

    listingType: { type: String, enum: ['Sell', 'Rent', 'Donate', 'Exchange'], required: true },

    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'],
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: function () {
        return this.listingType === 'Sell';
      },
    },
    rentalPrice: {
      type: Number,
      min: 0,
      required: function () {
        return this.listingType === 'Rent';
      },
    },

    description: { type: String, default: '' },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }, // needed to delete from Cloudinary later
      },
    ],

    status: { type: String, enum: ['Available', 'Reserved', 'Sold'], default: 'Available' },

    // Copied from owner at creation time - avoids a populate() just to filter by locality.
    locality: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// Matches our most common filter combination (Phase 7 index plan).
listingSchema.index({ category: 1, department: 1, semester: 1, locality: 1 });
listingSchema.index({ title: 'text', author: 'text' });

export const Listing = mongoose.model('Listing', listingSchema);
export { CATEGORIES };