import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    bio: z.string().max(500).optional(),
    college: z.string().optional(),
    department: z.string().optional(),
    semester: z.coerce.number().int().min(1).max(12).optional(),
    locality: z.string().min(2).optional(),
    whatsappNumber: z.string().min(8).optional(),
  }),
});