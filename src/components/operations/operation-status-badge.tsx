'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { OperationStatus } from '@/features/operations/types/operation.types'

const STATUS_VARIANT: Record<
  OperationStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  OPEN: 'secondary',
  IN_PROGRESS: 'default',
  ON_HOLD: 'outline',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
}

interface OperationStatusBadgeProps {
  status: OperationStatus
}

export function OperationStatusBadge({ status }: OperationStatusBadgeProps) {
  const t = useTranslations('operations')
  const labelMap: Record<OperationStatus, string> = {
    OPEN: t('open'),
    IN_PROGRESS: t('inProgress'),
    ON_HOLD: t('onHold'),
    COMPLETED: t('completed'),
    CANCELLED: t('cancelled'),
  }

  return (
    <Badge variant={STATUS_VARIANT[status]}>{labelMap[status]}</Badge>
  )
}
