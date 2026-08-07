import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    locality: z.string().min(2, 'Locality is required'),
    whatsappNumber: z.string().min(8, 'Enter a valid WhatsApp number'),
    college: z.string().optional(),
    department: z.string().optional(),
    semester: z.number().int().positive().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Enter a valid email'),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1),
  }),
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});
