'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { clientsApi, type ListClientsParams } from '../api/clients.api'
import type { CreateClientFormData, UpdateClientFormData } from '../schemas/client.schemas'

export function useClients(params?: ListClientsParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['clients', activeOrgId, params],
    queryFn: () => clientsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  })
}

export function useClient(clientId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['clients', activeOrgId, clientId],
    queryFn: () => clientsApi.getById(activeOrgId!, clientId),
    enabled: !!activeOrgId && !!clientId,
  })
}

export function useCreateClient() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: CreateClientFormData) =>
      clientsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', activeOrgId] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('clientCreateFailed'))
    },
  })
}

export function useUpdateClient(clientId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: UpdateClientFormData) =>
      clientsApi.update(activeOrgId!, clientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', activeOrgId] })
      toast.success(t('clientUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('clientUpdateFailed'))
    },
  })
}

export function useDeactivateClient() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (clientId: string) =>
      clientsApi.deactivate(activeOrgId!, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', activeOrgId] })
      toast.success(t('clientDeactivated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('clientDeactivateFailed'))
    },
  })
}
