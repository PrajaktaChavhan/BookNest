import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    targetType: z.enum(['Listing', 'User']),
    targetId: z.string().min(1),
    reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
  }),
});