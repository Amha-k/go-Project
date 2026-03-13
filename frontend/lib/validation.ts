import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be greater than 0'),
  eventDate: z.string().datetime('Invalid date'),
  ticketNumber: z.number().int().min(1, 'At least 1 ticket required'),
});

export const mfaSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type MFAFormData = z.infer<typeof mfaSchema>;
