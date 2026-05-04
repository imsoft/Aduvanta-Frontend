import { apiClient } from '@/lib/api-client';
import type { CustomsPatent } from '../types/customs-patent.types';

export const customsPatentsApi = {
  list: async (orgId: string): Promise<CustomsPatent[]> => {
    const { data } = await apiClient.get<CustomsPatent[]>(
      '/api/customs-patents',
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  getById: async (orgId: string, id: string): Promise<CustomsPatent> => {
    const { data } = await apiClient.get<CustomsPatent>(
      `/api/customs-patents/${id}`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    dto: { patentNumber: string; brokerName: string },
  ): Promise<CustomsPatent> => {
    const { data } = await apiClient.post<CustomsPatent>(
      '/api/customs-patents',
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    id: string,
    dto: Partial<{ patentNumber: string; brokerName: string }>,
  ): Promise<CustomsPatent> => {
    const { data } = await apiClient.patch<CustomsPatent>(
      `/api/customs-patents/${id}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  remove: async (orgId: string, id: string): Promise<void> => {
    await apiClient.delete(`/api/customs-patents/${id}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
