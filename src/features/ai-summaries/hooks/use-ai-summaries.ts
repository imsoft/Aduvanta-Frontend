import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { aiSummariesApi } from '../api/ai-summaries.api';

export function useGenerateAiSummary(operationId: string) {
  const { activeOrgId } = useOrgStore();

  return useMutation({
    mutationFn: () => aiSummariesApi.generateSummary(activeOrgId!, operationId),
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to generate summary');
    },
  });
}
