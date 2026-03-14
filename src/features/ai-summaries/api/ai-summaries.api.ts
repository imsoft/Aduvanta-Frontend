import { apiClient } from '@/lib/api-client';
import type { OperationAiSummary } from '../types/ai-summary.types';

export const aiSummariesApi = {
  generateSummary: async (
    orgId: string,
    operationId: string,
  ): Promise<OperationAiSummary> => {
    const { data } = await apiClient.post<OperationAiSummary>(
      `/api/ai/operations/${operationId}/summary`,
      {},
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
