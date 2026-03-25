'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { featureFlagsApi } from '../api/feature-flags.api'
import type { CreateFeatureFlagInput, UpdateFeatureFlagInput } from '../types/feature-flag.types'

export function useFeatureFlags() {
  const { activeOrgId } = useOrgStore()
  return useQuery({
    queryKey: ['feature-flags', activeOrgId],
    queryFn: () => featureFlagsApi.list(activeOrgId!),
    enabled: !!activeOrgId,
  })
}

export function useCreateFeatureFlag() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (input: CreateFeatureFlagInput) =>
      featureFlagsApi.create(activeOrgId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags', activeOrgId] })
      toast.success(t('featureFlagCreated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('featureFlagCreateFailed'))
    },
  })
}

export function useUpdateFeatureFlag() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: ({ flagId, input }: { flagId: string; input: UpdateFeatureFlagInput }) =>
      featureFlagsApi.update(activeOrgId!, flagId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags', activeOrgId] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('featureFlagUpdateFailed'))
    },
  })
}

export function useDeleteFeatureFlag() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (flagId: string) => featureFlagsApi.delete(activeOrgId!, flagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags', activeOrgId] })
      toast.success(t('featureFlagDeleted'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('featureFlagDeleteFailed'))
    },
  })
}
