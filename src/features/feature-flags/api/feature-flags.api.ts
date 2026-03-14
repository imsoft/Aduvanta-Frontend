import { apiClient } from '@/lib/api-client';
import type {
  FeatureFlag,
  CreateFeatureFlagInput,
  UpdateFeatureFlagInput,
} from '../types/feature-flag.types';

export const featureFlagsApi = {
  list: async (orgId: string): Promise<FeatureFlag[]> => {
    const { data } = await apiClient.get<FeatureFlag[]>('/api/feature-flags', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (
    orgId: string,
    input: CreateFeatureFlagInput,
  ): Promise<FeatureFlag> => {
    const { data } = await apiClient.post<FeatureFlag>(
      '/api/feature-flags',
      input,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    flagId: string,
    input: UpdateFeatureFlagInput,
  ): Promise<FeatureFlag> => {
    const { data } = await apiClient.patch<FeatureFlag>(
      `/api/feature-flags/${flagId}`,
      input,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  delete: async (orgId: string, flagId: string): Promise<void> => {
    await apiClient.delete(`/api/feature-flags/${flagId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
