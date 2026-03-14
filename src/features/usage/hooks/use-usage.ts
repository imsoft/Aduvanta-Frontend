import { useQuery } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { usageApi } from '../api/usage.api';

export function useUsage() {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['usage', activeOrgId],
    queryFn: () => usageApi.getUsage(activeOrgId!),
    enabled: !!activeOrgId,
  });
}
