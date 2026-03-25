'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { clientContactsApi } from '../api/client-contacts.api'
import type { ClientContactFormData } from '../schemas/client-contact.schemas'

export function useClientContacts(clientId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['client-contacts', activeOrgId, clientId],
    queryFn: () => clientContactsApi.list(activeOrgId!, clientId),
    enabled: !!activeOrgId && !!clientId,
  })
}

export function useCreateClientContact(clientId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: ClientContactFormData) =>
      clientContactsApi.create(activeOrgId!, clientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-contacts', activeOrgId, clientId],
      })
      toast.success(t('contactAdded'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('contactAddFailed'))
    },
  })
}

export function useUpdateClientContact(clientId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: ({
      contactId,
      dto,
    }: {
      contactId: string
      dto: ClientContactFormData
    }) => clientContactsApi.update(activeOrgId!, clientId, contactId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-contacts', activeOrgId, clientId],
      })
      toast.success(t('contactUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('contactUpdateFailed'))
    },
  })
}

export function useRemoveClientContact(clientId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (contactId: string) =>
      clientContactsApi.remove(activeOrgId!, clientId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-contacts', activeOrgId, clientId],
      })
      toast.success(t('contactRemoved'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('contactRemoveFailed'))
    },
  })
}
