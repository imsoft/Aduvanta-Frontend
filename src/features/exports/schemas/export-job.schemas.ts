import { z } from 'zod';

export const createExportJobSchema = z.object({
  type: z.enum(['CLIENTS', 'OPERATIONS', 'FINANCE']),
});

export type CreateExportJobFormData = z.infer<typeof createExportJobSchema>;
