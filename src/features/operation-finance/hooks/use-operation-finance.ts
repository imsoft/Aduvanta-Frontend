import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { operationFinanceApi } from '../api/operation-finance.api';

export function useOperationFinanceSummary(operationId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['finance-summary', activeOrgId, operationId],
    queryFn: () => operationFinanceApi.getSummary(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  });
}

export function useGenerateExpenseAccount(operationId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => operationFinanceApi.generateExpenseAccount(activeOrgId!, operationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-summary', activeOrgId, operationId] });
      toast.success('Expense account generated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to generate expense account');
    },
  });
}
