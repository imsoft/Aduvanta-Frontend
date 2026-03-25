'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  buildCreateOperationSchema,
  type CreateOperationFormData,
} from '@/features/operations/schemas/operation.schemas'
import type { Client } from '@/features/clients/types/client.types'

interface AssignableMember {
  id: string
  name: string
}

interface OperationFormProps {
  clients: Client[]
  members: AssignableMember[]
  onSubmit: (data: CreateOperationFormData) => void
  isPending: boolean
  submitLabel: string
  onCancel?: () => void
}

export function OperationForm({
  clients,
  members,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: OperationFormProps) {
  const t = useTranslations('operations')
  const tForm = useTranslations('operations.form')
  const tv = useTranslations('validation')
  const common = useTranslations('common')

  const schema = useMemo(
    () => buildCreateOperationSchema((k) => tv(k)),
    [tv],
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOperationFormData>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      type: 'IMPORT',
      priority: 'MEDIUM',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>
            {tForm('client')}
            {tForm('requiredMark')}
          </Label>
          <Select
            onValueChange={(v) => setValue('clientId', v)}
            value={watch('clientId')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clientId && (
            <p className="text-xs text-destructive">{errors.clientId.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reference">
            {tForm('reference')}
            {tForm('requiredMark')}
          </Label>
          <Input id="reference" {...register('reference')} />
          {errors.reference && (
            <p className="text-xs text-destructive">{errors.reference.message}</p>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title">
            {tForm('title')}
            {tForm('requiredMark')}
          </Label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            {tForm('type')}
            {tForm('requiredMark')}
          </Label>
          <Select
            onValueChange={(v) =>
              setValue('type', v as CreateOperationFormData['type'])
            }
            value={watch('type')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMPORT">{t('types.IMPORT')}</SelectItem>
              <SelectItem value="EXPORT">{t('types.EXPORT')}</SelectItem>
              <SelectItem value="INTERNAL">{t('types.INTERNAL')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>
            {tForm('priority')}
            {tForm('requiredMark')}
          </Label>
          <Select
            onValueChange={(v) =>
              setValue('priority', v as CreateOperationFormData['priority'])
            }
            value={watch('priority')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">{t('low')}</SelectItem>
              <SelectItem value="MEDIUM">{t('medium')}</SelectItem>
              <SelectItem value="HIGH">{t('high')}</SelectItem>
              <SelectItem value="URGENT">{t('urgent')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>{tForm('assignTo')}</Label>
          <Select
            onValueChange={(v) => setValue('assignedUserId', v === '_none' ? '' : v)}
            value={watch('assignedUserId') || '_none'}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">{common('unassigned')}</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dueAt">{tForm('dueDate')}</Label>
          <Input id="dueAt" type="date" {...register('dueAt')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">{tForm('description')}</Label>
        <textarea
          id="description"
          rows={3}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
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
