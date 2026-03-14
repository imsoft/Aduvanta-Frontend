import { apiClient } from '@/lib/api-client';
import type { OrganizationUsage } from '../types/usage.types';

export const usageApi = {
  getUsage: async (orgId: string): Promise<OrganizationUsage> => {
    const { data } = await apiClient.get<OrganizationUsage>('/api/usage', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },
};
