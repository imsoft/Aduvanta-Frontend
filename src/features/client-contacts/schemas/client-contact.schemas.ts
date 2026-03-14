import { z } from 'zod';

export const clientContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  position: z.string().max(255).optional(),
  isPrimary: z.boolean().optional(),
});

export type ClientContactFormData = z.infer<typeof clientContactSchema>;
