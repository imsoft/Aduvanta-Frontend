'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { operationChargesApi, type ListChargesParams } from '../api/operation-charges.api'
import type { CreateChargeFormData, UpdateChargeFormData } from '../schemas/operation-charge.schemas'

export function useOperationCharges(operationId: string, params?: ListChargesParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['charges', activeOrgId, operationId, params],
    queryFn: () => operationChargesApi.list(activeOrgId!, operationId, params),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function useCreateCharge(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: CreateChargeFormData) =>
      operationChargesApi.create(activeOrgId!, operationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charges', activeOrgId, operationId] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', activeOrgId, operationId] })
      toast.success(t('chargeCreated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('chargeCreateFailed'))
    },
  })
}

export function useUpdateCharge(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: ({ chargeId, dto }: { chargeId: string; dto: UpdateChargeFormData }) =>
      operationChargesApi.update(activeOrgId!, operationId, chargeId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charges', activeOrgId, operationId] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', activeOrgId, operationId] })
      toast.success(t('chargeUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('chargeUpdateFailed'))
    },
  })
}

export function useDeactivateCharge(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (chargeId: string) =>
      operationChargesApi.deactivate(activeOrgId!, operationId, chargeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charges', activeOrgId, operationId] })
      queryClient.invalidateQueries({ queryKey: ['finance-summary', activeOrgId, operationId] })
      toast.success(t('chargeDeactivated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('chargeDeactivateFailed'))
    },
  })
}
