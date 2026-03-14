import { Badge } from '@/components/ui/badge';
import type { OperationStatus } from '@/features/operations/types/operation.types';

const STATUS_CONFIG: Record<
  OperationStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  OPEN: { label: 'Open', variant: 'secondary' },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' },
  ON_HOLD: { label: 'On Hold', variant: 'outline' },
  COMPLETED: { label: 'Completed', variant: 'secondary' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
};

interface OperationStatusBadgeProps {
  status: OperationStatus;
}

export function OperationStatusBadge({ status }: OperationStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
