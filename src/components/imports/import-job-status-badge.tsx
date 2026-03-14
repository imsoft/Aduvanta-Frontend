import type { ImportJobStatus } from '@/features/imports/types/import-job.types';

const statusConfig: Record<ImportJobStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'text-muted-foreground' },
  PROCESSING: { label: 'Processing', className: 'text-amber-600 dark:text-amber-400' },
  COMPLETED: { label: 'Completed', className: 'text-green-600 dark:text-green-400' },
  FAILED: { label: 'Failed', className: 'text-destructive' },
};

export function ImportJobStatusBadge({ status }: { status: ImportJobStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`text-xs font-medium ${config.className}`}>{config.label}</span>
  );
}
