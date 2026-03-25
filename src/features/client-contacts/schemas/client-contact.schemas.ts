import { z } from 'zod'
import type { ValidationT } from '@/features/operations/schemas/operation.schemas'

export const buildClientContactSchema = (t: ValidationT) =>
  z.object({
    name: z.string().min(1, t('nameRequired')).max(255),
    email: z.string().email(t('invalidEmail')).optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    position: z.string().max(255).optional(),
    isPrimary: z.boolean().optional(),
  })

export type ClientContactFormData = z.infer<ReturnType<typeof buildClientContactSchema>>
