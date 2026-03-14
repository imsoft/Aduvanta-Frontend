'use client';

import { ArrowRight } from '@phosphor-icons/react';
import { useOperationHistory } from '@/features/operations/hooks/use-operations';
import { OperationStatusBadge } from './operation-status-badge';
import type { OperationStatus } from '@/features/operations/types/operation.types';

interface OperationTimelineProps {
  operationId: string;
}

export function OperationTimeline({ operationId }: OperationTimelineProps) {
  const { data: history = [], isLoading } = useOperationHistory(operationId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading timeline…</p>;
  }

  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">No history yet.</p>;
  }

  // Show most recent first.
  const sorted = [...history].reverse();

  return (
    <div className="space-y-3">
      {sorted.map((entry) => (
        <div
          key={entry.id}
          className="flex items-start gap-4 rounded-lg border p-4"
        >
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {entry.fromStatus ? (
              <>
                <OperationStatusBadge status={entry.fromStatus as OperationStatus} />
                <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                <OperationStatusBadge status={entry.toStatus as OperationStatus} />
              </>
            ) : (
              <>
                <span className="text-xs text-muted-foreground">Initial</span>
                <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                <OperationStatusBadge status={entry.toStatus as OperationStatus} />
              </>
            )}
          </div>
          <div className="text-right shrink-0">
            {entry.comment && (
              <p className="text-sm text-muted-foreground mb-1">{entry.comment}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
