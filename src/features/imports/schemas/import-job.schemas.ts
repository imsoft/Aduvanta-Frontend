import { z } from 'zod';

export const createImportJobSchema = z.object({
  type: z.literal('CLIENTS'),
});

export type CreateImportJobFormData = z.infer<typeof createImportJobSchema>;
