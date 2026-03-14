import { z } from 'zod';

export const createChargeSchema = z.object({
  type: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  amount: z.number().positive(),
  currency: z.string().min(1).max(10),
});

export const updateChargeSchema = z.object({
  type: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().min(1).max(10).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type CreateChargeFormData = z.infer<typeof createChargeSchema>;
export type UpdateChargeFormData = z.infer<typeof updateChargeSchema>;
