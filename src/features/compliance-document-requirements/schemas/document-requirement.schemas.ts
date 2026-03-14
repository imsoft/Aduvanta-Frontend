import { z } from 'zod';

export const createDocumentRequirementSchema = z.object({
  documentCategoryId: z.string().uuid(),
  isRequired: z.boolean().optional(),
});

export const updateDocumentRequirementSchema = z.object({
  isRequired: z.boolean().optional(),
});

export type CreateDocumentRequirementFormData = z.infer<typeof createDocumentRequirementSchema>;
export type UpdateDocumentRequirementFormData = z.infer<typeof updateDocumentRequirementSchema>;
