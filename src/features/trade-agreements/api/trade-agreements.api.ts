import { apiClient } from '@/lib/api-client';
import type {
  TradeAgreement,
  TariffPreference,
  ListTradeAgreementsResult,
} from '../types/trade-agreement.types';

export interface ListTradeAgreementsParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export const tradeAgreementsApi = {
  list: async (
    params?: ListTradeAgreementsParams,
  ): Promise<ListTradeAgreementsResult> => {
    const { data } = await apiClient.get<ListTradeAgreementsResult>(
      '/api/trade-agreements',
      { params },
    );
    return data;
  },

  getById: async (id: string): Promise<TradeAgreement> => {
    const { data } = await apiClient.get<TradeAgreement>(
      `/api/trade-agreements/${id}`,
    );
    return data;
  },

  listPreferences: async (id: string): Promise<TariffPreference[]> => {
    const { data } = await apiClient.get<TariffPreference[]>(
      `/api/trade-agreements/${id}/preferences`,
    );
    return data;
  },

  listPreferencesByFraction: async (
    fractionId: string,
  ): Promise<TariffPreference[]> => {
    const { data } = await apiClient.get<TariffPreference[]>(
      `/api/trade-agreements/preferences/by-fraction/${fractionId}`,
    );
    return data;
  },

  create: async (
    orgId: string,
    dto: {
      code: string;
      name: string;
      partnerCountries: string;
      effectiveDate?: string;
      notes?: string;
    },
  ): Promise<TradeAgreement> => {
    const { data } = await apiClient.post<TradeAgreement>(
      '/api/trade-agreements',
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    id: string,
    dto: Partial<{
      name: string;
      partnerCountries: string;
      effectiveDate: string;
      expirationDate: string;
      isActive: boolean;
      notes: string;
    }>,
  ): Promise<TradeAgreement> => {
    const { data } = await apiClient.patch<TradeAgreement>(
      `/api/trade-agreements/${id}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
