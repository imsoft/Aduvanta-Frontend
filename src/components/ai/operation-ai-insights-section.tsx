'use client';

import { useState } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGenerateAiSummary } from '@/features/ai-summaries/hooks/use-ai-summaries';
import type { OperationAiSummary } from '@/features/ai-summaries/types/ai-summary.types';
import { OperationAiSignalsList } from './operation-ai-signals-list';
import { OperationAiSummaryCard } from './operation-ai-summary-card';

interface OperationAiInsightsSectionProps {
  operationId: string;
}

export function OperationAiInsightsSection({
  operationId,
}: OperationAiInsightsSectionProps) {
  const [summary, setSummary] = useState<OperationAiSummary | null>(null);
  const generateSummary = useGenerateAiSummary(operationId);

  return (
    <div className="space-y-6">
      {/* Signals */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Detected signals</h3>
        <OperationAiSignalsList operationId={operationId} />
      </div>

      <Separator />

      {/* Summary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Operation summary</h3>
          {!summary && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() =>
                generateSummary.mutate(undefined, {
                  onSuccess: (data) => setSummary(data),
                })
              }
              disabled={generateSummary.isPending}
            >
              <Sparkle size={14} />
              {generateSummary.isPending ? 'Generating…' : 'Generate summary'}
            </Button>
          )}
          {summary && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-2 text-muted-foreground"
              onClick={() =>
                generateSummary.mutate(undefined, {
                  onSuccess: (data) => setSummary(data),
                })
              }
              disabled={generateSummary.isPending}
            >
              <Sparkle size={14} />
              {generateSummary.isPending ? 'Refreshing…' : 'Refresh'}
            </Button>
          )}
        </div>

        {summary ? (
          <OperationAiSummaryCard summary={summary} />
        ) : (
          <div className="rounded-md border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Generate an AI summary to get a concise overview of this operation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
