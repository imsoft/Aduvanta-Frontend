import { apiClient } from '@/lib/api-client';
import type { OperationFinanceSummary } from '../types/operation-finance.types';

export const operationFinanceApi = {
  getSummary: async (
    orgId: string,
    operationId: string,
  ): Promise<OperationFinanceSummary> => {
    const { data } = await apiClient.get<OperationFinanceSummary>(
      `/api/operations/${operationId}/finance-summary`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  generateExpenseAccount: async (
    orgId: string,
    operationId: string,
  ): Promise<OperationFinanceSummary> => {
    const { data } = await apiClient.post<OperationFinanceSummary>(
      `/api/operations/${operationId}/expense-account`,
      {},
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
