'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { useAiSearch } from '@/features/ai-search/hooks/use-ai-search';
import type { AiSearchResult } from '@/features/ai-search/types/ai-search.types';
import { AiSearchForm } from '@/components/ai/ai-search-form';
import { AiSearchResults } from '@/components/ai/ai-search-results';

export default function AiPage() {
  const t = useTranslations();
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const search = useAiSearch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('ai.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('ai.description')}
        </p>
      </div>

      <Separator />

      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-sm font-semibold mb-4">{t('ai.searchTitle')}</h2>
          <AiSearchForm
            onSubmit={(data) =>
              search.mutate(data, {
                onSuccess: (res) => setResult(res),
              })
            }
            isPending={search.isPending}
          />
        </div>

        {result && (
          <>
            <Separator />
            <AiSearchResults result={result} />
          </>
        )}
      </div>
    </div>
  );
}
