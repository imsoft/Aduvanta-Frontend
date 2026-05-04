import { apiClient } from '@/lib/api-client';
import type { Nom, ListNomsResult } from '../types/nom.types';

export interface ListNomsParams {
  q?: string;
  application?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const nomsApi = {
  list: async (params?: ListNomsParams): Promise<ListNomsResult> => {
    const { data } = await apiClient.get<ListNomsResult>('/api/noms', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<Nom> => {
    const { data } = await apiClient.get<Nom>(`/api/noms/${id}`);
    return data;
  },

  getByFraction: async (fractionId: string): Promise<Nom[]> => {
    const { data } = await apiClient.get<Nom[]>(
      `/api/noms/by-fraction/${fractionId}`,
    );
    return data;
  },
};
