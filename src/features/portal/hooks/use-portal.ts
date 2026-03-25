'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { portalApi, type ListPortalOperationsParams } from '../api/portal.api'

export function usePortalOperations(params?: ListPortalOperationsParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['portal-operations', activeOrgId, params],
    queryFn: () => portalApi.listOperations(activeOrgId!, params),
    enabled: !!activeOrgId,
  })
}

export function usePortalOperation(operationId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['portal-operation', activeOrgId, operationId],
    queryFn: () => portalApi.getOperation(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function usePortalStatusHistory(operationId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['portal-history', activeOrgId, operationId],
    queryFn: () => portalApi.getStatusHistory(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function usePortalComments(operationId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['portal-comments', activeOrgId, operationId],
    queryFn: () => portalApi.listComments(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function usePortalDocuments(operationId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['portal-documents', activeOrgId, operationId],
    queryFn: () => portalApi.listDocuments(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function usePortalDocumentDownload() {
  const { activeOrgId } = useOrgStore()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (documentId: string) =>
      portalApi.getDocumentDownloadUrl(activeOrgId!, documentId),
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('portalDownloadFailed'))
    },
  })
}
