'use client';

import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CardsSkeleton } from '@/components/ui/loading-skeletons';
import { EmptyState } from '@/components/ui/empty-state';
import { useMySubscription, usePlans } from '@/features/subscriptions/hooks/use-subscriptions';
import { useAssignPlan } from '@/features/subscriptions/hooks/use-subscriptions';
import { useIsOwner } from '@/hooks/use-permissions';
import { PlanSummaryCard } from '@/components/billing/plan-summary-card';

export default function BillingPage() {
  const t = useTranslations();
  const canManage = useIsOwner();

  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const assignPlan = useAssignPlan();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('billing.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('billing.description')}
        </p>
      </div>

      <Separator />

      {subLoading ? (
        <div className="space-y-3 rounded-lg border bg-card p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : subscription ? (
        <PlanSummaryCard data={subscription} />
      ) : (
        <EmptyState title={t('billing.noPlan')} />
      )}

      {canManage && plans.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-base font-semibold mb-4">{t('billing.availablePlans')}</h2>
            {plansLoading ? (
              <CardsSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="rounded-lg border p-4 space-y-3">
                    <div>
                      <p className="font-semibold">{plan.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{plan.code}</p>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>{t('billing.upToUsers', { count: String(plan.maxUsers) })}</li>
                      <li>{t('billing.upToClients', { count: String(plan.maxClients) })}</li>
                      <li>{t('billing.upToOperations', { count: String(plan.maxOperations) })}</li>
                      <li>{t('billing.upToIntegrations', { count: String(plan.maxIntegrations) })}</li>
                    </ul>
                    <button
                      onClick={() => assignPlan.mutate(plan.id)}
                      disabled={
                        assignPlan.isPending ||
                        subscription?.plan.id === plan.id
                      }
                      className="text-xs text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                    >
                      {subscription?.plan.id === plan.id
                        ? t('billing.currentPlan')
                        : t('billing.switchPlan')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
