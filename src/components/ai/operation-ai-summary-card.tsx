'use client';

import type { OperationAiSummary } from '@/features/ai-summaries/types/ai-summary.types';

interface OperationAiSummaryCardProps {
  summary: OperationAiSummary;
}

export function OperationAiSummaryCard({ summary }: OperationAiSummaryCardProps) {
  return (
    <div className="space-y-3">
      <SummarySection label="Overview" text={summary.overview} />
      <SummarySection label="Documents" text={summary.documentStatus} />
      <SummarySection label="Compliance" text={summary.complianceStatus} />
      <SummarySection label="Finance" text={summary.financeStatus} />
      <div className="rounded-md border bg-accent/30 p-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          Suggested next step
        </p>
        <p className="text-sm">{summary.nextSuggestedStep}</p>
      </div>
    </div>
  );
}

function SummarySection({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm">{text}</p>
    </div>
  );
}
