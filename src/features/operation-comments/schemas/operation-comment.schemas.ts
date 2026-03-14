import { z } from 'zod';

export const createOperationCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(10000),
});

export type CreateOperationCommentFormData = z.infer<typeof createOperationCommentSchema>;
