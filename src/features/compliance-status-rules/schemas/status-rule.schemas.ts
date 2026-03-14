import { z } from 'zod';

const operationStatusEnum = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
]);

export const createStatusRuleSchema = z.object({
  fromStatus: operationStatusEnum,
  toStatus: operationStatusEnum,
  requiresAllRequiredDocuments: z.boolean().optional(),
});

export const updateStatusRuleSchema = z.object({
  requiresAllRequiredDocuments: z.boolean().optional(),
});

export type CreateStatusRuleFormData = z.infer<typeof createStatusRuleSchema>;
export type UpdateStatusRuleFormData = z.infer<typeof updateStatusRuleSchema>;
