import { apiClient } from '@/lib/api-client';

export interface TariffClassificationResult {
  fraction: string;
  description: string;
  confidence: number;
  reasoning: string;
  importTariff: string | null;
  exportTariff: string | null;
  vatRate: string | null;
  alternatives: Array<{ fraction: string; description: string; confidence: number }>;
  cached: boolean;
}

export const tariffClassifierApi = {
  classify: async (orgId: string, description: string): Promise<TariffClassificationResult> => {
    const { data } = await apiClient.post(
      '/api/ai/tariff/classify',
      { description },
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
