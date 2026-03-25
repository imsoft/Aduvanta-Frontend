'use client'

import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  changeStatusSchema,
  type ChangeStatusFormData,
} from '@/features/operations/schemas/operation.schemas'
import type { OperationStatus } from '@/features/operations/types/operation.types'

interface ChangeOperationStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: OperationStatus
  onSubmit: (data: ChangeStatusFormData) => void
  isPending: boolean
}

const STATUS_VALUES: OperationStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
]

export function ChangeOperationStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onSubmit,
  isPending,
}: ChangeOperationStatusDialogProps) {
  const t = useTranslations('operations')
  const tForm = useTranslations('operations.form')
  const common = useTranslations('common')

  const statusLabel = useMemo(() => {
    const map: Record<OperationStatus, string> = {
      OPEN: t('open'),
      IN_PROGRESS: t('inProgress'),
      ON_HOLD: t('onHold'),
      COMPLETED: t('completed'),
      CANCELLED: t('cancelled'),
    }
    return map
  }, [t])

  const { handleSubmit, setValue, watch, register, reset } = useForm<ChangeStatusFormData>({
    resolver: standardSchemaResolver(changeStatusSchema),
  })

  const selected = watch('status')

  useEffect(() => {
    if (!open) return
    const next =
      STATUS_VALUES.find((s) => s !== currentStatus) ?? currentStatus
    reset({ status: next, comment: '' })
  }, [open, currentStatus, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{tForm('changeStatusTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{tForm('newStatus')}</Label>
            <Select
              onValueChange={(v) => setValue('status', v as OperationStatus)}
              value={selected}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_VALUES.filter((s) => s !== currentStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment">{tForm('commentOptional')}</Label>
            <textarea
              id="comment"
              rows={2}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('comment')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {common('cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? common('saving') : tForm('updateStatus')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
