import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { subscriptionsApi } from '../api/subscriptions.api';

export function usePlans() {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['plans', activeOrgId],
    queryFn: () => subscriptionsApi.listPlans(activeOrgId!),
    enabled: !!activeOrgId,
  });
}

export function useMySubscription() {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['subscription', activeOrgId],
    queryFn: () => subscriptionsApi.getMySubscription(activeOrgId!),
    enabled: !!activeOrgId,
  });
}

export function useAssignPlan() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) =>
      subscriptionsApi.assignPlan(activeOrgId!, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', activeOrgId] });
      toast.success('Plan assigned successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to assign plan');
    },
  });
}
