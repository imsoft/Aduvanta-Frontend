'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { documentsApi, type ListDocumentsParams } from '../api/documents.api'
import type { UpdateDocumentFormData } from '../schemas/document.schemas'

export function useOperationDocuments(operationId: string, params?: ListDocumentsParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['documents', activeOrgId, operationId, params],
    queryFn: () => documentsApi.listForOperation(activeOrgId!, operationId, params),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function useDocumentVersions(documentId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['document-versions', activeOrgId, documentId],
    queryFn: () => documentsApi.getVersions(activeOrgId!, documentId),
    enabled: !!activeOrgId && !!documentId,
  })
}

export function useUploadDocument(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: ({
      file,
      meta,
    }: {
      file: File
      meta: { name?: string; description?: string; categoryId?: string }
    }) => documentsApi.upload(activeOrgId!, operationId, file, meta),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      })
      toast.success(t('documentUploaded'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('documentUploadFailed'))
    },
  })
}

export function useUpdateDocument(documentId: string, operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: UpdateDocumentFormData) =>
      documentsApi.update(activeOrgId!, documentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      })
      toast.success(t('documentUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('documentUpdateFailed'))
    },
  })
}

export function useDeactivateDocument(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (documentId: string) =>
      documentsApi.deactivate(activeOrgId!, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      })
      toast.success(t('documentDeactivated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('documentDeactivateFailed'))
    },
  })
}

export function useUploadDocumentVersion(documentId: string, operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (file: File) =>
      documentsApi.uploadVersion(activeOrgId!, documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      })
      queryClient.invalidateQueries({
        queryKey: ['document-versions', activeOrgId, documentId],
      })
      toast.success(t('documentVersionUploaded'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('documentVersionFailed'))
    },
  })
}

export function useDocumentDownloadUrl() {
  const { activeOrgId } = useOrgStore()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (documentId: string) =>
      documentsApi.getDownloadUrl(activeOrgId!, documentId),
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('documentDownloadFailed'))
    },
  })
}
