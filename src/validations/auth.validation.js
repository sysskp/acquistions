import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(20),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signInSchema = z.object({
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(20),
});
