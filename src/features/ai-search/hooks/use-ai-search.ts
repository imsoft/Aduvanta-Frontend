'use client'

import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org.store'
import { aiSearchApi } from '../api/ai-search.api'
import type { CreateAiSearchQueryInput } from '../types/ai-search.types'

export function useAiSearch() {
  const { activeOrgId } = useOrgStore()
  const t = useTranslations('toast')

  return useMutation({
    mutationFn: (input: CreateAiSearchQueryInput) =>
      aiSearchApi.search(activeOrgId!, input),
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('searchFailed'))
    },
  })
}
