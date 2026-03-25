'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import {
  complianceRuleSetsApi,
  type ListRuleSetsParams,
} from '../api/compliance-rule-sets.api'
import type { CreateRuleSetFormData, UpdateRuleSetFormData } from '../schemas/rule-set.schemas'

export function useComplianceRuleSets(params?: ListRuleSetsParams) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['compliance-rule-sets', activeOrgId, params],
    queryFn: () => complianceRuleSetsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  })
}

export function useComplianceRuleSet(ruleSetId: string) {
  const { activeOrgId } = useOrgStore()

  return useQuery({
    queryKey: ['compliance-rule-sets', activeOrgId, ruleSetId],
    queryFn: () => complianceRuleSetsApi.getById(activeOrgId!, ruleSetId),
    enabled: !!activeOrgId && !!ruleSetId,
  })
}

export function useCreateComplianceRuleSet() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: CreateRuleSetFormData) =>
      complianceRuleSetsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-rule-sets', activeOrgId] })
      toast.success(t('ruleSetCreated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('ruleSetCreateFailed'))
    },
  })
}

export function useUpdateComplianceRuleSet(ruleSetId: string) {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (dto: UpdateRuleSetFormData) =>
      complianceRuleSetsApi.update(activeOrgId!, ruleSetId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-rule-sets', activeOrgId] })
      toast.success(t('ruleSetUpdated'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('ruleSetUpdateFailed'))
    },
  })
}

export function useDeleteComplianceRuleSet() {
  const { activeOrgId } = useOrgStore()
  const queryClient = useQueryClient()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (ruleSetId: string) =>
      complianceRuleSetsApi.delete(activeOrgId!, ruleSetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-rule-sets', activeOrgId] })
      toast.success(t('ruleSetDeleted'))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('ruleSetDeleteFailed'))
    },
  })
}
