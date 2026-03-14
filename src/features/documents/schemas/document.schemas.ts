import { z } from 'zod';

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type UpdateDocumentFormData = z.infer<typeof updateDocumentSchema>;
