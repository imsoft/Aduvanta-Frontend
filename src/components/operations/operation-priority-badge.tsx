import { Badge } from '@/components/ui/badge';
import type { OperationPriority } from '@/features/operations/types/operation.types';

const PRIORITY_CONFIG: Record<
  OperationPriority,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  LOW: { label: 'Low', variant: 'outline' },
  MEDIUM: { label: 'Medium', variant: 'secondary' },
  HIGH: { label: 'High', variant: 'default' },
  URGENT: { label: 'Urgent', variant: 'destructive' },
};

interface OperationPriorityBadgeProps {
  priority: OperationPriority;
}

export function OperationPriorityBadge({ priority }: OperationPriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
