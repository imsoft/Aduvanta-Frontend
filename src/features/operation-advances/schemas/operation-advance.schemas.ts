import { z } from 'zod';

export const createAdvanceSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(1).max(10),
  reference: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  receivedAt: z.string().min(1),
});

export const updateAdvanceSchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.string().min(1).max(10).optional(),
  reference: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  receivedAt: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type CreateAdvanceFormData = z.infer<typeof createAdvanceSchema>;
export type UpdateAdvanceFormData = z.infer<typeof updateAdvanceSchema>;
