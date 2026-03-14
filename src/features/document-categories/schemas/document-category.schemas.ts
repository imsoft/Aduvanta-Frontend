import { z } from 'zod';

export const createDocumentCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z
    .string()
    .min(1, 'Code is required')
    .max(50)
    .regex(/^[A-Z0-9_]+$/, 'Code must be uppercase letters, digits, and underscores only'),
  description: z.string().max(1000).optional(),
});

export const updateDocumentCategorySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
});

export type CreateDocumentCategoryFormData = z.infer<typeof createDocumentCategorySchema>;
export type UpdateDocumentCategoryFormData = z.infer<typeof updateDocumentCategorySchema>;
