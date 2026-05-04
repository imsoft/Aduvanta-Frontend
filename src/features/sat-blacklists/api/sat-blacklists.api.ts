import { apiClient } from '@/lib/api-client';
import type {
  ListBlacklistResult,
  TaxpayerCheckResult,
} from '../types/sat-blacklist.types';

export interface ListBlacklistParams {
  q?: string;
  listType?: string;
  limit?: number;
  offset?: number;
}

export const satBlacklistsApi = {
  list: async (params?: ListBlacklistParams): Promise<ListBlacklistResult> => {
    const { data } = await apiClient.get<ListBlacklistResult>(
      '/api/sat-blacklists',
      { params },
    );
    return data;
  },

  check: async (taxId: string): Promise<TaxpayerCheckResult> => {
    const { data } = await apiClient.get<TaxpayerCheckResult>(
      `/api/sat-blacklists/check/${encodeURIComponent(taxId)}`,
    );
    return data;
  },
};
