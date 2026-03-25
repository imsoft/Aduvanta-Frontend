'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { integrationsApi, type ListIntegrationsParams } from '../api/integrations.api'
import type { CreateIntegrationFormData, UpdateIntegrationFormData } from '../schemas/integration.schemas'

export function useIntegrations(params?: ListIntegrationsParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['integrations', activeOrgId, params],
    queryFn: () => integrationsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  })
}

export function useIntegration(integrationId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['integrations', activeOrgId, integrationId],
    queryFn: () => integrationsApi.getById(activeOrgId!, integrationId),
    enabled: !!activeOrgId && !!integrationId,
  })
}

export function useCreateIntegration() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: CreateIntegrationFormData) =>
      integrationsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', activeOrgId] })
      toast.success(t('integrationCreated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('integrationCreateFailed'))
    },
  })
}

export function useUpdateIntegration(integrationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: UpdateIntegrationFormData) =>
      integrationsApi.update(activeOrgId!, integrationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', activeOrgId] })
      toast.success(t('integrationUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('integrationUpdateFailed'))
    },
  })
}

export function useDeactivateIntegration() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (integrationId: string) =>
      integrationsApi.deactivate(activeOrgId!, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', activeOrgId] })
      toast.success(t('integrationDeactivated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('integrationDeactivateFailed'))
    },
  })
}
