import { z } from 'zod';

export const startConversationSchema = z.object({
  body: z.object({
    listingId: z.string().min(1, 'listingId is required'),
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({
    before: z.string().datetime().optional(),
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
});