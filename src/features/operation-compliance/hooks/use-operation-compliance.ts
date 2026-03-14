import { useQuery } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { operationComplianceApi } from '../api/operation-compliance.api';

export function useOperationCompliance(operationId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['operation-compliance', activeOrgId, operationId],
    queryFn: () => operationComplianceApi.evaluate(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  });
}
