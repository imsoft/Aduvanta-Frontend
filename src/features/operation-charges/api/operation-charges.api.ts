import { apiClient } from '@/lib/api-client';
import type { OperationCharge } from '../types/operation-charge.types';
import type { CreateChargeFormData, UpdateChargeFormData } from '../schemas/operation-charge.schemas';

export interface ListChargesParams {
  status?: 'ACTIVE' | 'INACTIVE';
}

export const operationChargesApi = {
  list: async (
    orgId: string,
    operationId: string,
    params?: ListChargesParams,
  ): Promise<OperationCharge[]> => {
    const { data } = await apiClient.get<OperationCharge[]>(
      `/api/operations/${operationId}/charges`,
      { params, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    operationId: string,
    dto: CreateChargeFormData,
  ): Promise<OperationCharge> => {
    const { data } = await apiClient.post<OperationCharge>(
      `/api/operations/${operationId}/charges`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    operationId: string,
    chargeId: string,
    dto: UpdateChargeFormData,
  ): Promise<OperationCharge> => {
    const { data } = await apiClient.patch<OperationCharge>(
      `/api/operations/${operationId}/charges/${chargeId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  deactivate: async (
    orgId: string,
    operationId: string,
    chargeId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/api/operations/${operationId}/charges/${chargeId}`,
      { headers: { 'x-organization-id': orgId } },
    );
  },
};
