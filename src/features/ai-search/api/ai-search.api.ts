import { apiClient } from '@/lib/api-client';
import type { AiSearchResult, CreateAiSearchQueryInput } from '../types/ai-search.types';

export const aiSearchApi = {
  search: async (
    orgId: string,
    input: CreateAiSearchQueryInput,
  ): Promise<AiSearchResult> => {
    const { data } = await apiClient.post<AiSearchResult>(
      '/api/ai/search',
      input,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
