import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  legalName: z.string().max(255).optional(),
  taxId: z.string().max(100).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateClientSchema = createClientSchema.extend({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
