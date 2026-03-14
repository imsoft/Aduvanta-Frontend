import { cn } from '@/lib/utils';
import type { SignalCode } from '@/features/ai-signals/types/ai-signal.types';

const signalConfig: Record<SignalCode, { label: string; className: string }> = {
  MISSING_REQUIRED_DOCUMENTS: {
    label: 'Missing documents',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  BLOCKED_STATUS_TRANSITION: {
    label: 'Blocked transition',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  OVERDUE_OPERATION: {
    label: 'Overdue',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  NO_ASSIGNEE: {
    label: 'No assignee',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  PENDING_FINANCIAL_BALANCE: {
    label: 'Pending balance',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
};

export function AiSignalBadge({ code }: { code: SignalCode }) {
  const config = signalConfig[code];

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
