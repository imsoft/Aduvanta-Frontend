'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { documentCategoriesApi } from '../api/document-categories.api'
import type {
  CreateDocumentCategoryFormData,
  UpdateDocumentCategoryFormData,
} from '../schemas/document-category.schemas'

export function useDocumentCategories() {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['document-categories', activeOrgId],
    queryFn: () => documentCategoriesApi.list(activeOrgId!),
    enabled: !!activeOrgId,
  })
}

export function useCreateDocumentCategory() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: CreateDocumentCategoryFormData) =>
      documentCategoriesApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-categories', activeOrgId] })
      toast.success(t('categoryCreated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('categoryCreateFailed'))
    },
  })
}

export function useUpdateDocumentCategory(categoryId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: UpdateDocumentCategoryFormData) =>
      documentCategoriesApi.update(activeOrgId!, categoryId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-categories', activeOrgId] })
      toast.success(t('categoryUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('categoryUpdateFailed'))
    },
  })
}

export function useRemoveDocumentCategory() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (categoryId: string) =>
      documentCategoriesApi.remove(activeOrgId!, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-categories', activeOrgId] })
      toast.success(t('categoryRemoved'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('categoryRemoveFailed'))
    },
  })
}
