import { z } from 'zod'
import type { ValidationT } from '@/features/operations/schemas/operation.schemas'

export const buildCreateClientSchema = (t: ValidationT) =>
  z.object({
    name: z.string().min(1, t('nameRequired')).max(255),
    legalName: z.string().max(255).optional(),
    taxId: z.string().max(100).optional(),
    email: z.string().email(t('invalidEmail')).optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    notes: z.string().max(2000).optional(),
  })

export const buildUpdateClientSchema = (t: ValidationT) =>
  buildCreateClientSchema(t).extend({
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  })

export type CreateClientFormData = z.infer<ReturnType<typeof buildCreateClientSchema>>
export type UpdateClientFormData = z.infer<ReturnType<typeof buildUpdateClientSchema>>
