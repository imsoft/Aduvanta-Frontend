'use client';

import { useAiSignals } from '@/features/ai-signals/hooks/use-ai-signals';
import { AiSeverityBadge } from './ai-severity-badge';

interface OperationAiSignalsListProps {
  operationId: string;
}

export function OperationAiSignalsList({ operationId }: OperationAiSignalsListProps) {
  const { data, isLoading } = useAiSignals(operationId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Analyzing operation…</p>;
  }

  if (!data || data.signals.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-4 text-center">
        <p className="text-sm text-muted-foreground">No signals detected. Operation looks healthy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.signals.map((signal, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-md border p-3"
        >
          <div className="mt-0.5 shrink-0">
            <AiSeverityBadge severity={signal.severity} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{signal.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{signal.description}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground capitalize">{signal.source}</span>
        </div>
      ))}
    </div>
  );
}
