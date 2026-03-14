import { useQuery } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { aiSignalsApi } from '../api/ai-signals.api';

export function useAiSignals(operationId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['ai-signals', activeOrgId, operationId],
    queryFn: () => aiSignalsApi.getSignals(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  });
}
