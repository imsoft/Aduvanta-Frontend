import { Badge } from '@/components/ui/badge';
import type { DocumentStatus } from '@/features/documents/types/document.types';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  return (
    <Badge variant={status === 'ACTIVE' ? 'secondary' : 'outline'}>
      {status === 'ACTIVE' ? 'Active' : 'Inactive'}
    </Badge>
  );
}
