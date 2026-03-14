import type { ImportResultSummary } from '@/features/imports/types/import-job.types';

export function ImportResultSummaryCard({ summary }: { summary: ImportResultSummary }) {
  return (
    <div className="rounded-md border p-4 space-y-3">
      <h3 className="text-sm font-semibold">Import result</h3>
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Processed" value={summary.processed} />
        <Stat label="Created" value={summary.created} className="text-green-600 dark:text-green-400" />
        <Stat label="Failed" value={summary.failed} className={summary.failed > 0 ? 'text-destructive' : undefined} />
      </div>
      {summary.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Errors
          </p>
          <ul className="space-y-0.5">
            {summary.errors.slice(0, 10).map((err, i) => (
              <li key={i} className="text-xs text-destructive">
                {err}
              </li>
            ))}
            {summary.errors.length > 10 && (
              <li className="text-xs text-muted-foreground">
                +{summary.errors.length - 10} more errors
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-semibold ${className ?? ''}`}>{value}</p>
    </div>
  );
}
