'use client';

import { Badge } from '@/components/ui/badge';
import type { EntryStatus } from '@/features/customs-entries/types/customs-entry.types';

const STATUS_LABELS: Record<EntryStatus, string> = {
  DRAFT: 'Borrador',
  PREVALIDATED: 'Prevalidado',
  VALIDATED: 'Validado',
  PAID: 'Pagado',
  DISPATCHED: 'Modulado',
  RELEASED: 'Liberado',
  CANCELLED: 'Cancelado',
  RECTIFIED: 'Rectificado',
};

const STATUS_VARIANT: Record<
  EntryStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  DRAFT: 'outline',
  PREVALIDATED: 'secondary',
  VALIDATED: 'secondary',
  PAID: 'default',
  DISPATCHED: 'default',
  RELEASED: 'secondary',
  CANCELLED: 'destructive',
  RECTIFIED: 'outline',
};

// Color classes for custom styling
const STATUS_CLASS: Record<EntryStatus, string> = {
  DRAFT: 'text-muted-foreground',
  PREVALIDATED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  VALIDATED: 'bg-blue-100 text-blue-800 border-blue-200',
  PAID: 'bg-purple-100 text-purple-800 border-purple-200',
  DISPATCHED: 'bg-orange-100 text-orange-800 border-orange-200',
  RELEASED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: '',
  RECTIFIED: 'bg-gray-100 text-gray-700 border-gray-200',
};

interface EntryStatusBadgeProps {
  status: EntryStatus;
}

export function EntryStatusBadge({ status }: EntryStatusBadgeProps) {
  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className={STATUS_CLASS[status]}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
