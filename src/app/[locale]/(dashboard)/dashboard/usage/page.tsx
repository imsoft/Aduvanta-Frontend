'use client';

import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { CardsSkeleton } from '@/components/ui/loading-skeletons';
import { EmptyState } from '@/components/ui/empty-state';
import { useUsage } from '@/features/usage/hooks/use-usage';
import { UsageMetricsCards } from '@/components/billing/usage-metrics-cards';

export default function UsagePage() {
  const t = useTranslations();
  const { data: usage, isLoading } = useUsage();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('usage.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('usage.description')}
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <CardsSkeleton count={4} gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" />
      ) : usage ? (
        <div className="w-full space-y-4">
          {usage.planName && (
            <p className="text-sm text-muted-foreground">
              {t('usage.plan')}: <span className="font-medium text-foreground">{usage.planName}</span>
              {usage.planCode && (
                <span className="font-mono text-xs ml-1">({usage.planCode})</span>
              )}
            </p>
          )}
          <UsageMetricsCards usage={usage} />
          {!usage.limits && (
            <p className="text-xs text-muted-foreground">
              {t('usage.noLimits')}
            </p>
          )}
        </div>
      ) : (
        <EmptyState title={t('usage.noData')} />
      )}
    </div>
  );
}
