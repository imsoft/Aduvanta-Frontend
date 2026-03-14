import { z } from 'zod';

export const WEBHOOK_EVENT_TYPES = [
  'operation.created',
  'operation.updated',
  'operation.status_changed',
  'document.created',
  'document.version_uploaded',
  'finance.charge_created',
  'finance.advance_created',
] as const;

export const createIntegrationSchema = z.object({
  name: z.string().min(1).max(200),
  provider: z.literal('WEBHOOK'),
  targetUrl: z.string().url(),
  secret: z.string().max(500).optional(),
  eventTypes: z
    .array(z.enum(WEBHOOK_EVENT_TYPES))
    .min(1, 'Select at least one event type'),
});

export const updateIntegrationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  targetUrl: z.string().url().optional(),
  secret: z.string().max(500).optional(),
  eventTypes: z.array(z.enum(WEBHOOK_EVENT_TYPES)).min(1).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type CreateIntegrationFormData = z.infer<typeof createIntegrationSchema>;
export type UpdateIntegrationFormData = z.infer<typeof updateIntegrationSchema>;
