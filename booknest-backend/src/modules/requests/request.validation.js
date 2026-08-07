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

export const createRequestSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().optional(),
    isbn: z.string().optional(),
    category: categoryEnum.optional(),
    notes: z.string().optional(),
  }),
});

export const browseRequestsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: categoryEnum.optional(),
    locality: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
  }),
});