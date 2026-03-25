import { z } from 'zod'

export type ValidationT = (key: string) => string

export const buildCreateOperationSchema = (t: ValidationT) =>
  z.object({
    clientId: z.string().uuid(t('selectClient')),
    reference: z.string().min(1, t('referenceRequired')).max(100),
    title: z.string().min(1, t('titleRequired')).max(500),
    description: z.string().max(5000).optional(),
    type: z.enum(['IMPORT', 'EXPORT', 'INTERNAL']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    assignedUserId: z.string().uuid().optional().or(z.literal('')),
    dueAt: z.string().optional(),
  })

export const updateOperationSchema = z.object({
  reference: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional(),
  type: z.enum(['IMPORT', 'EXPORT', 'INTERNAL']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueAt: z.string().optional(),
})

export const changeStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']),
  comment: z.string().max(1000).optional(),
})

export const assignOperationSchema = z.object({
  assignedUserId: z.string().uuid().nullable(),
})

export type CreateOperationFormData = z.infer<
  ReturnType<typeof buildCreateOperationSchema>
>
export type UpdateOperationFormData = z.infer<typeof updateOperationSchema>
export type ChangeStatusFormData = z.infer<typeof changeStatusSchema>
export type AssignOperationFormData = z.infer<typeof assignOperationSchema>
