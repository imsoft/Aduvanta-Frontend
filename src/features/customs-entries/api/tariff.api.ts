import { apiClient } from '@/lib/api-client';

export interface TariffFraction {
  id: string;
  fraction: string;
  description: string;
  generalDutyRate: string | null;
  vatRate: string | null;
  unit: string | null;
  regulations: string[];
  tradeAgreementRates: { agreement: string; rate: string }[];
}

export interface TariffChapter {
  id: string;
  chapter: string;
  description: string;
}

export interface TariffSection {
  id: string;
  section: string;
  description: string;
}

export interface TariffSearchResult {
  fractions: TariffFraction[];
  total: number;
}

export const tariffApi = {
  search: async (q: string, limit = 20, offset = 0): Promise<TariffSearchResult> => {
    const { data } = await apiClient.get<TariffSearchResult>(
      '/api/tariff-classification/fractions/search',
      { params: { q, limit, offset } },
    );
    return data;
  },

  getByFraction: async (fraction: string): Promise<TariffFraction> => {
    const { data } = await apiClient.get<TariffFraction>(
      `/api/tariff-classification/fractions/${fraction}`,
    );
    return data;
  },

  listChapters: async (): Promise<TariffChapter[]> => {
    const { data } = await apiClient.get<TariffChapter[]>(
      '/api/tariff-classification/chapters',
    );
    return data;
  },

  listSections: async (): Promise<TariffSection[]> => {
    const { data } = await apiClient.get<TariffSection[]>(
      '/api/tariff-classification/sections',
    );
    return data;
  },
};
