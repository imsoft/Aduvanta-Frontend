'use client';

import { OperationStatusBadge } from '@/components/operations/operation-status-badge';
import { usePortalStatusHistory } from '@/features/portal/hooks/use-portal';
import type { OperationStatus } from '@/features/operations/types/operation.types';

interface PortalOperationTimelineProps {
  operationId: string;
}

export function PortalOperationTimeline({ operationId }: PortalOperationTimelineProps) {
  const { data: history = [], isLoading } = usePortalStatusHistory(operationId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading timeline…</p>;
  }

  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">No status history yet.</p>;
  }

  return (
    <ol className="space-y-4">
      {[...history].reverse().map((entry) => (
        <li key={entry.id} className="flex items-start gap-3">
          <div className="mt-0.5 h-2 w-2 rounded-full bg-muted-foreground/40 shrink-0 mt-1.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {entry.fromStatus && (
                <>
                  <OperationStatusBadge status={entry.fromStatus as OperationStatus} />
                  <span className="text-xs text-muted-foreground">→</span>
                </>
              )}
              <OperationStatusBadge status={entry.toStatus as OperationStatus} />
            </div>
            {entry.comment && (
              <p className="text-xs text-muted-foreground">{entry.comment}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
