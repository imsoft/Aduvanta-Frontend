import { apiClient } from '@/lib/api-client';

export interface MarketRatesResponse {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
  source: 'cache' | 'live';
}

export interface FixRateResponse {
  date: string;
  usdMxn: number;
  source: string;
  note: string;
}

export const exchangeRatesApi = {
  getMarketRates: async (base = 'MXN'): Promise<MarketRatesResponse> => {
    const { data } = await apiClient.get('/api/exchange-rates/market', {
      params: { base },
    });
    return data as MarketRatesResponse;
  },

  getFixRate: async (): Promise<FixRateResponse> => {
    const { data } = await apiClient.get('/api/exchange-rates/fix');
    return data as FixRateResponse;
  },
};
