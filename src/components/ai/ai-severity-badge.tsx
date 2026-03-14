import { cn } from '@/lib/utils';
import type { SignalSeverity } from '@/features/ai-signals/types/ai-signal.types';

const severityConfig: Record<SignalSeverity, { label: string; className: string }> = {
  INFO: {
    label: 'Info',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  WARNING: {
    label: 'Warning',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  CRITICAL: {
    label: 'Critical',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export function AiSeverityBadge({ severity }: { severity: SignalSeverity }) {
  const config = severityConfig[severity];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
