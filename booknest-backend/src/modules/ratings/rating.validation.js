import { z } from 'zod';

export const createRatingSchema = z.object({
  body: z.object({
    listingId: z.string().min(1, 'listingId is required'),
    ratedUserId: z.string().min(1, 'ratedUserId is required'),
    score: z.coerce.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
  }),
});

export const respondToRatingSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    response: z.string().min(1, 'Response cannot be empty').max(1000),
  }),
});