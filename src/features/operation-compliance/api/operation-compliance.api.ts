import { apiClient } from '@/lib/api-client';
import type { OperationComplianceEvaluation } from '../types/operation-compliance.types';

export const operationComplianceApi = {
  evaluate: async (
    orgId: string,
    operationId: string,
  ): Promise<OperationComplianceEvaluation> => {
    const { data } = await apiClient.get<OperationComplianceEvaluation>(
      `/api/operations/${operationId}/compliance`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
