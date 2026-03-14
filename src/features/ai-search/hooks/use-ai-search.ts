import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { aiSearchApi } from '../api/ai-search.api';
import type { CreateAiSearchQueryInput } from '../types/ai-search.types';

export function useAiSearch() {
  const { activeOrgId } = useOrgStore();

  return useMutation({
    mutationFn: (input: CreateAiSearchQueryInput) =>
      aiSearchApi.search(activeOrgId!, input),
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Search failed');
    },
  });
}
