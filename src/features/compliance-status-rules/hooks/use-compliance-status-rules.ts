import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { complianceStatusRulesApi } from '../api/compliance-status-rules.api';
import type {
  CreateStatusRuleFormData,
  UpdateStatusRuleFormData,
} from '../schemas/status-rule.schemas';

export function useStatusRules(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['status-rules', activeOrgId, ruleSetId],
    queryFn: () => complianceStatusRulesApi.listForRuleSet(activeOrgId!, ruleSetId),
    enabled: !!activeOrgId && !!ruleSetId,
  });
}

export function useCreateStatusRule(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateStatusRuleFormData) =>
      complianceStatusRulesApi.create(activeOrgId!, ruleSetId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['status-rules', activeOrgId, ruleSetId],
      });
      toast.success('Status rule added');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to add status rule');
    },
  });
}

export function useUpdateStatusRule(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      statusRuleId,
      dto,
    }: {
      statusRuleId: string;
      dto: UpdateStatusRuleFormData;
    }) => complianceStatusRulesApi.update(activeOrgId!, statusRuleId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['status-rules', activeOrgId, ruleSetId],
      });
      toast.success('Status rule updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to update status rule');
    },
  });
}

export function useDeleteStatusRule(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statusRuleId: string) =>
      complianceStatusRulesApi.delete(activeOrgId!, statusRuleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['status-rules', activeOrgId, ruleSetId],
      });
      toast.success('Status rule removed');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to remove status rule');
    },
  });
}
