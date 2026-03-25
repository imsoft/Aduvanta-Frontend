import { z } from 'zod'
import type { ValidationT } from '@/features/operations/schemas/operation.schemas'

export const buildCreateAiSearchQuerySchema = (t: ValidationT) =>
  z.object({
    queryText: z.string().min(1, t('queryRequired')).max(500),
    queryType: z.enum([
      'PENDING_OPERATIONS',
      'URGENT_WITHOUT_ASSIGNEE',
      'OVERDUE_OPERATIONS',
    ]),
  })

export type CreateAiSearchQueryFormData = z.infer<
  ReturnType<typeof buildCreateAiSearchQuerySchema>
>
