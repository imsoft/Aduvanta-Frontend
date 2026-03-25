import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge';
import type { ClientStatus } from '@/features/clients/types/client.types';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const t = useTranslations()

  return (
    <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
      {status === 'ACTIVE' ? t('clients.active') : t('clients.inactive')}
    </Badge>
  );
}
