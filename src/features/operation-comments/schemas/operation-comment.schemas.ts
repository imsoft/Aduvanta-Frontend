import { z } from 'zod'
import type { ValidationT } from '@/features/operations/schemas/operation.schemas'

export const buildCreateOperationCommentSchema = (t: ValidationT) =>
  z.object({
    body: z.string().min(1, t('commentNotEmpty')).max(10000),
  })

export type CreateOperationCommentFormData = z.infer<
  ReturnType<typeof buildCreateOperationCommentSchema>
>
