'use client';

import type { OrganizationUsage } from '@/features/usage/types/usage.types';
import { useTranslations } from 'next-intl'

interface UsageMetricsCardsProps {
  usage: OrganizationUsage;
}

export function UsageMetricsCards({ usage }: UsageMetricsCardsProps) {
  const t = useTranslations()
  const { metrics, limits } = usage;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UsageCard
        label={t('usage.metrics.users')}
        value={metrics.users}
        max={limits?.maxUsers ?? null}
      />
      <UsageCard
        label={t('usage.metrics.clients')}
        value={metrics.clients}
        max={limits?.maxClients ?? null}
      />
      <UsageCard
        label={t('usage.metrics.operations')}
        value={metrics.operations}
        max={limits?.maxOperations ?? null}
      />
      <UsageCard
        label={t('usage.metrics.integrations')}
        value={metrics.integrations}
        max={limits?.maxIntegrations ?? null}
      />
    </div>
  );
}

function UsageCard({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number | null;
}) {
  const t = useTranslations()

  const pct = max !== null ? Math.min((value / max) * 100, 100) : null;
  const isNearLimit = pct !== null && pct >= 80;
  const isAtLimit = pct !== null && pct >= 100;

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-semibold">
        {value.toLocaleString()}
        {max !== null && (
          <span className="text-sm font-normal text-muted-foreground ml-1">
            / {max.toLocaleString()}
          </span>
        )}
      </p>
      {pct !== null && (
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isAtLimit
                  ? 'bg-red-500'
                  : isNearLimit
                  ? 'bg-amber-500'
                  : 'bg-primary'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {isNearLimit && (
            <p
              className={`text-xs ${isAtLimit ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}
            >
              {isAtLimit
                ? t('usage.limitReached')
                : t('usage.pctUsed', { pct: Math.round(pct) })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
