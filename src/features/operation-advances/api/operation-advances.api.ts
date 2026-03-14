import { apiClient } from '@/lib/api-client';
import type { OperationAdvance } from '../types/operation-advance.types';
import type { CreateAdvanceFormData, UpdateAdvanceFormData } from '../schemas/operation-advance.schemas';

export interface ListAdvancesParams {
  status?: 'ACTIVE' | 'INACTIVE';
}

export const operationAdvancesApi = {
  list: async (
    orgId: string,
    operationId: string,
    params?: ListAdvancesParams,
  ): Promise<OperationAdvance[]> => {
    const { data } = await apiClient.get<OperationAdvance[]>(
      `/api/operations/${operationId}/advances`,
      { params, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    operationId: string,
    dto: CreateAdvanceFormData,
  ): Promise<OperationAdvance> => {
    const { data } = await apiClient.post<OperationAdvance>(
      `/api/operations/${operationId}/advances`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    operationId: string,
    advanceId: string,
    dto: UpdateAdvanceFormData,
  ): Promise<OperationAdvance> => {
    const { data } = await apiClient.patch<OperationAdvance>(
      `/api/operations/${operationId}/advances/${advanceId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  deactivate: async (
    orgId: string,
    operationId: string,
    advanceId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/api/operations/${operationId}/advances/${advanceId}`,
      { headers: { 'x-organization-id': orgId } },
    );
  },
};
