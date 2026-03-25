'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { operationAdvancesApi, type ListAdvancesParams } from '../api/operation-advances.api'
import type { CreateAdvanceFormData, UpdateAdvanceFormData } from '../schemas/operation-advance.schemas'

export function useOperationAdvances(operationId: string, params?: ListAdvancesParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['advances', activeOrgId, operationId, params],
    queryFn: () => operationAdvancesApi.list(activeOrgId!, operationId, params),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function useCreateAdvance(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: CreateAdvanceFormData) =>
      operationAdvancesApi.create(activeOrgId!, operationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advances', activeOrgId, operationId] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', activeOrgId, operationId] })
      toast.success(t('advanceRegistered'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('advanceRegisterFailed'))
    },
  })
}

export function useUpdateAdvance(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: ({ advanceId, dto }: { advanceId: string; dto: UpdateAdvanceFormData }) =>
      operationAdvancesApi.update(activeOrgId!, operationId, advanceId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advances', activeOrgId, operationId] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', activeOrgId, operationId] })
      toast.success(t('advanceUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('advanceUpdateFailed'))
    },
  })
}

export function useDeactivateAdvance(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (advanceId: string) =>
      operationAdvancesApi.deactivate(activeOrgId!, operationId, advanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advances', activeOrgId, operationId] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', activeOrgId, operationId] })
      toast.success(t('advanceDeactivated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('advanceDeactivateFailed'))
    },
  })
}
