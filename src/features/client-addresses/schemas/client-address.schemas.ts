import { z } from 'zod'
import type { ValidationT } from '@/features/operations/schemas/operation.schemas'

export const buildClientAddressSchema = (t: ValidationT) =>
  z.object({
    label: z.string().min(1, t('labelRequired')).max(100),
    country: z.string().min(2, t('countryRequired')).max(100),
    state: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    street1: z.string().min(1, t('streetRequired')).max(255),
    street2: z.string().max(255).optional(),
    reference: z.string().max(500).optional(),
    isPrimary: z.boolean().optional(),
  })

export type ClientAddressFormData = z.infer<ReturnType<typeof buildClientAddressSchema>>
