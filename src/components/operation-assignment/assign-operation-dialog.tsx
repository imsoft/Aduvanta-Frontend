'use client'

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
  assignOperationSchema,
  type AssignOperationFormData,
} from '@/features/operations/schemas/operation.schemas'

interface AssignableMember {
  id: string
  name: string
}

interface AssignOperationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAssignedUserId: string | null
  members: AssignableMember[]
  onSubmit: (data: AssignOperationFormData) => void
  isPending: boolean
}

export function AssignOperationDialog({
  open,
  onOpenChange,
  currentAssignedUserId,
  members,
  onSubmit,
  isPending,
}: AssignOperationDialogProps) {
  const t = useTranslations('operations')
  const tForm = useTranslations('operations.form')
  const common = useTranslations('common')

  const { handleSubmit, setValue } = useForm<AssignOperationFormData>({
    resolver: standardSchemaResolver(assignOperationSchema),
    defaultValues: { assignedUserId: currentAssignedUserId },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('assignDialogTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{tForm('assignTo')}</Label>
            <Select
              defaultValue={currentAssignedUserId ?? '_none'}
              onValueChange={(v) =>
                setValue('assignedUserId', v === '_none' ? null : v)
              }
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
              {isPending ? common('saving') : tForm('saveAssignment')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
