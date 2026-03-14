import { apiClient } from '@/lib/api-client';
import type { OperationSignalsResponse } from '../types/ai-signal.types';

export const aiSignalsApi = {
  getSignals: async (
    orgId: string,
    operationId: string,
  ): Promise<OperationSignalsResponse> => {
    const { data } = await apiClient.get<OperationSignalsResponse>(
      `/api/ai/operations/${operationId}/signals`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
