import { z } from 'zod';

export const createRuleSetSchema = z.object({
  name: z.string().min(1).max(200),
  code: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9_]+$/, 'Must be uppercase alphanumeric with underscores'),
  operationType: z.enum(['IMPORT', 'EXPORT', 'INTERNAL']),
  isActive: z.boolean().optional(),
});

export const updateRuleSetSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9_]+$/)
    .optional(),
  operationType: z.enum(['IMPORT', 'EXPORT', 'INTERNAL']).optional(),
  isActive: z.boolean().optional(),
});

export type CreateRuleSetFormData = z.infer<typeof createRuleSetSchema>;
export type UpdateRuleSetFormData = z.infer<typeof updateRuleSetSchema>;
