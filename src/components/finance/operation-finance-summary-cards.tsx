'use client';

import { useTranslations } from 'next-intl';
import { useOperationFinanceSummary } from '@/features/operation-finance/hooks/use-operation-finance';
import type { FinancialStatus } from '@/features/operation-finance/types/operation-finance.types';
import { CardsSkeleton } from '@/components/ui/loading-skeletons';

interface OperationFinanceSummaryCardsProps {
  operationId: string;
}

function financialStatusClass(status: FinancialStatus): string {
  switch (status) {
    case 'PAID': return 'text-green-600 dark:text-green-400';
    case 'PARTIALLY_PAID': return 'text-yellow-600 dark:text-yellow-400';
    case 'PENDING': return 'text-muted-foreground';
    case 'NO_CHARGES': return 'text-muted-foreground';
  }
}

export function OperationFinanceSummaryCards({
  operationId,
}: OperationFinanceSummaryCardsProps) {
  const t = useTranslations('finance');
  const { data: summary, isLoading } = useOperationFinanceSummary(operationId);

  if (isLoading) {
    return (
      <CardsSkeleton
        count={4}
        gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-4"
      />
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SummaryCard label={t('summaryCards.totalCharges')} value={summary.totalCharges} />
      <SummaryCard label={t('summaryCards.totalAdvances')} value={summary.totalAdvances} />
      <SummaryCard label={t('summaryCards.pendingBalance')} value={summary.pendingBalance} />
      <div className="rounded-md border px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('summaryCards.status')}
        </p>
        <p className={`mt-1 text-sm font-semibold ${financialStatusClass(summary.financialStatus)}`}>
          {t(`financialStatus.${summary.financialStatus}`)}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  const num = parseFloat(value);
  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="rounded-md border px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{formatted}</p>
    </div>
  );
}
