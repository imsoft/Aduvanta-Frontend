import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { featureFlagsApi } from '../api/feature-flags.api';
import type { CreateFeatureFlagInput, UpdateFeatureFlagInput } from '../types/feature-flag.types';

export function useFeatureFlags() {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['feature-flags', activeOrgId],
    queryFn: () => featureFlagsApi.list(activeOrgId!),
    enabled: !!activeOrgId,
  });
}

export function useCreateFeatureFlag() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFeatureFlagInput) =>
      featureFlagsApi.create(activeOrgId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags', activeOrgId] });
      toast.success('Feature flag created');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to create flag');
    },
  });
}

export function useUpdateFeatureFlag() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flagId, input }: { flagId: string; input: UpdateFeatureFlagInput }) =>
      featureFlagsApi.update(activeOrgId!, flagId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags', activeOrgId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to update flag');
    },
  });
}

export function useDeleteFeatureFlag() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flagId: string) => featureFlagsApi.delete(activeOrgId!, flagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags', activeOrgId] });
      toast.success('Feature flag deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to delete flag');
    },
  });
}
