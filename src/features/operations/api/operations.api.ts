import { apiClient } from '@/lib/api-client';
import type { Operation, OperationStatusHistory } from '../types/operation.types';
import type {
  CreateOperationFormData,
  UpdateOperationFormData,
  ChangeStatusFormData,
  AssignOperationFormData,
} from '../schemas/operation.schemas';

export interface ListOperationsParams {
  search?: string;
  clientId?: string;
  status?: string;
  priority?: string;
  assignedUserId?: string;
  limit?: number;
  offset?: number;
}

export const operationsApi = {
  list: async (orgId: string, params?: ListOperationsParams): Promise<Operation[]> => {
    const { data } = await apiClient.get<Operation[]>('/api/operations', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, operationId: string): Promise<Operation> => {
    const { data } = await apiClient.get<Operation>(`/api/operations/${operationId}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (orgId: string, dto: CreateOperationFormData): Promise<Operation> => {
    const { data } = await apiClient.post<Operation>('/api/operations', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  update: async (
    orgId: string,
    operationId: string,
    dto: UpdateOperationFormData,
  ): Promise<Operation> => {
    const { data } = await apiClient.patch<Operation>(
      `/api/operations/${operationId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  deactivate: async (orgId: string, operationId: string): Promise<void> => {
    await apiClient.delete(`/api/operations/${operationId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },

  changeStatus: async (
    orgId: string,
    operationId: string,
    dto: ChangeStatusFormData,
  ): Promise<Operation> => {
    const { data } = await apiClient.post<Operation>(
      `/api/operations/${operationId}/status`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  assign: async (
    orgId: string,
    operationId: string,
    dto: AssignOperationFormData,
  ): Promise<Operation> => {
    const { data } = await apiClient.post<Operation>(
      `/api/operations/${operationId}/assign`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  getHistory: async (
    orgId: string,
    operationId: string,
  ): Promise<OperationStatusHistory[]> => {
    const { data } = await apiClient.get<OperationStatusHistory[]>(
      `/api/operations/${operationId}/history`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
