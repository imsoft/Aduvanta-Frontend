'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl'
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AI_SEARCH_QUERY_TYPES,
} from '@/features/ai-search/types/ai-search.types';
import {
  createAiSearchQuerySchema,
  type CreateAiSearchQueryFormData,
} from '@/features/ai-search/schemas/ai-search.schemas';

interface AiSearchFormProps {
  onSubmit: (data: CreateAiSearchQueryFormData) => void;
  isPending: boolean;
}

export function AiSearchForm({ onSubmit, isPending }: AiSearchFormProps) {
  const t = useTranslations()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAiSearchQueryFormData>({
    resolver: standardSchemaResolver(createAiSearchQuerySchema),
    defaultValues: {
      queryType: 'PENDING_OPERATIONS',
      queryText: '',
    },
  });

  const queryType = watch('queryType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('ai.searchForm.queryTypeLabel')}
        </label>
        <Select
          value={queryType}
          onValueChange={(v) =>
            setValue('queryType', v as CreateAiSearchQueryFormData['queryType'])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AI_SEARCH_QUERY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`ai.queryTypes.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('ai.searchForm.additionalContextLabel')}
        </label>
        <textarea
          {...register('queryText')}
          rows={2}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
        {errors.queryText && (
          <p className="text-xs text-destructive">{errors.queryText.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="gap-2">
        <MagnifyingGlass size={14} />
        {isPending ? t('ai.searchForm.searching') : t('ai.searchForm.search')}
      </Button>
    </form>
  );
}
