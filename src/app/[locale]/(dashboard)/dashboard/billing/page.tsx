'use client';

import { useTranslations } from 'next-intl';
import { CreditCard, Star } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardsSkeleton } from '@/components/ui/loading-skeletons';
import { EmptyState } from '@/components/ui/empty-state';
import {
  useMySubscription,
  usePlans,
  useAssignPlan,
  usePaymentMethods,
} from '@/features/subscriptions/hooks/use-subscriptions';
import { useIsOwner } from '@/hooks/use-permissions';
import { PlanSummaryCard } from '@/components/billing/plan-summary-card';
import { subscriptionsApi } from '@/features/subscriptions/api/subscriptions.api';
import { useOrgStore } from '@/store/org.store';

const CARD_BRAND_LABEL: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  jcb: 'JCB',
  unionpay: 'UnionPay',
  diners: 'Diners Club',
};

export default function BillingPage() {
  const t = useTranslations();
  const canManage = useIsOwner();
  const { activeOrgId } = useOrgStore();

  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: paymentMethods = [], isLoading: cardsLoading } = usePaymentMethods();
  const assignPlan = useAssignPlan();

  const handleManageCards = async () => {
    if (!activeOrgId) return;
    const { url } = await subscriptionsApi.createPortalSession(activeOrgId);
    window.location.href = url;
  };

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

      {/* Payment methods */}
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">{t('billing.paymentMethods')}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{t('billing.paymentMethodsDesc')}</p>
          </div>
          {canManage && (
            <Button variant="outline" size="sm" onClick={handleManageCards}>
              <CreditCard size={14} className="mr-1.5" />
              {t('billing.manageCards')}
            </Button>
          )}
        </div>

        {cardsLoading && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!cardsLoading && paymentMethods.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <CreditCard size={28} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">{t('billing.noPaymentMethods')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('billing.noPaymentMethodsHint')}</p>
          </div>
        )}

        {!cardsLoading && paymentMethods.length > 0 && (
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="flex h-9 w-14 items-center justify-center rounded border bg-muted/40">
                  <CreditCard size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {CARD_BRAND_LABEL[pm.brand] ?? pm.brand.toUpperCase()} ••••{pm.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('billing.cardExpiry', {
                      month: String(pm.expMonth).padStart(2, '0'),
                      year: String(pm.expYear),
                    })}
                  </p>
                </div>
                {pm.isDefault && (
                  <Badge variant="secondary" className="shrink-0">
                    <Star size={10} className="mr-1" weight="fill" />
                    {t('billing.defaultBadge')}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available plans */}
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
