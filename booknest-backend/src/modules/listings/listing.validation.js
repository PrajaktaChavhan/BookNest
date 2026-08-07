    import { z } from 'zod';

const categoryEnum = z.enum([
  'Academic',
  'Competitive Exam',
  'Fiction',
  'Non-Fiction',
  'Comics',
  'Biography',
  "Children's",
  'Other',
]);
const listingTypeEnum = z.enum(['Sell', 'Rent', 'Donate', 'Exchange']);
const conditionEnum = z.enum(['Brand New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor']);

// Shared refinement: if category is Academic, department + semester are required.
// If listingType is Sell/Rent, the matching price field is required.
// Mirrors the Mongoose-level conditional validation so bad requests are
// rejected at the API boundary, before ever reaching the database.
const baseListingFields = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().optional(),
  category: categoryEnum,
  department: z.string().optional(),
  semester: z.coerce.number().int().min(1).max(12).optional(),
  listingType: listingTypeEnum,
  condition: conditionEnum,
  price: z.coerce.number().min(0).optional(),
  rentalPrice: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
});

function applyConditionalRules(data, ctx) {
  if (data.category === 'Academic' && (!data.department || !data.semester)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Department and semester are required for Academic category',
      path: ['department'],
    });
  }
  if (data.listingType === 'Sell' && data.price === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Price is required for a Sell listing',
      path: ['price'],
    });
  }
  if (data.listingType === 'Rent' && data.rentalPrice === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Rental price is required for a Rent listing',
      path: ['rentalPrice'],
    });
  }
}

export const createListingSchema = z.object({
  body: baseListingFields.superRefine(applyConditionalRules),
});

export const updateListingSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: baseListingFields.partial(), // partial update - PATCH semantics
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: z.enum(['Available', 'Reserved', 'Sold']),
  }),
});

export const searchListingsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: categoryEnum.optional(),
    department: z.string().optional(),
    semester: z.coerce.number().int().optional(),
    condition: conditionEnum.optional(),
    listingType: listingTypeEnum.optional(),
    locality: z.string().optional(),
    priceMin: z.coerce.number().optional(),
    priceMax: z.coerce.number().optional(),
    owner: z.string().optional(),
    status: z.enum(['Available', 'Reserved', 'Sold']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
  }),
});