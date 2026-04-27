'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  buildCreateClientSchema,
  type CreateClientFormData,
} from '@/features/clients/schemas/client.schemas'
import type { Client } from '@/features/clients/types/client.types'

interface ClientFormProps {
  defaultValues?: Partial<Client>
  onSubmit: (data: CreateClientFormData) => void
  isPending: boolean
  submitLabel: string
  onCancel?: () => void
}

export function ClientForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: ClientFormProps) {
  const t = useTranslations('clients')
  const tv = useTranslations('validation')
  const common = useTranslations('common')

  const schema = useMemo(
    () => buildCreateClientSchema((k) => tv(k)),
    [tv],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClientFormData>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      legalName: defaultValues?.legalName ?? '',
      taxId: defaultValues?.taxId ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      notes: defaultValues?.notes ?? '',
    },
  })

  const required = t('requiredMark')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            {t('name')}
            {required}
          </Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="legalName">{t('legalName')}</Label>
          <Input id="legalName" {...register('legalName')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="taxId">{t('taxId')}</Label>
          <Input id="taxId" {...register('taxId')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input id="phone" {...register('phone')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">{t('notes')}</Label>
        <textarea
          id="notes"
          rows={3}
          className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register('notes')}
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            {common('cancel')}
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? common('saving') : submitLabel}
        </Button>
      </div>
    </form>
  )
}
