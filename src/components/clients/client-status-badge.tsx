import { Badge } from '@/components/ui/badge';
import type { ClientStatus } from '@/features/clients/types/client.types';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  return (
    <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
      {status === 'ACTIVE' ? 'Active' : 'Inactive'}
    </Badge>
  );
}
