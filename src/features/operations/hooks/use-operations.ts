'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { operationsApi, type ListOperationsParams } from '../api/operations.api'
import type {
  CreateOperationFormData,
  UpdateOperationFormData,
  ChangeStatusFormData,
  AssignOperationFormData,
} from '../schemas/operation.schemas'

export function useOperations(params?: ListOperationsParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['operations', activeOrgId, params],
    queryFn: () => operationsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  })
}

export function useOperation(operationId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['operations', activeOrgId, operationId],
    queryFn: () => operationsApi.getById(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function useOperationHistory(operationId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['operation-history', activeOrgId, operationId],
    queryFn: () => operationsApi.getHistory(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  })
}

export function useCreateOperation() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: CreateOperationFormData) =>
      operationsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', activeOrgId] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('operationCreateFailed'))
    },
  })
}

export function useUpdateOperation(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: UpdateOperationFormData) =>
      operationsApi.update(activeOrgId!, operationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', activeOrgId] })
      toast.success(t('operationUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('operationUpdateFailed'))
    },
  })
}

export function useDeactivateOperation() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (operationId: string) =>
      operationsApi.deactivate(activeOrgId!, operationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', activeOrgId] })
      toast.success(t('operationCancelled'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('operationCancelFailed'))
    },
  })
}

export function useChangeOperationStatus(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: ChangeStatusFormData) =>
      operationsApi.changeStatus(activeOrgId!, operationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', activeOrgId] })
      queryClient.invalidateQueries({
        queryKey: ['operation-history', activeOrgId, operationId],
      })
      toast.success(t('operationStatusUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('operationStatusUpdateFailed'))
    },
  })
}

export function useAssignOperation(operationId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: AssignOperationFormData) =>
      operationsApi.assign(activeOrgId!, operationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', activeOrgId] })
      toast.success(t('assignmentUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('assignmentUpdateFailed'))
    },
  })
}
