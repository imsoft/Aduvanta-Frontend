'use client';

import { Separator } from '@/components/ui/separator';
import { useMySubscription, usePlans } from '@/features/subscriptions/hooks/use-subscriptions';
import { useAssignPlan } from '@/features/subscriptions/hooks/use-subscriptions';
import { useIsOwner } from '@/hooks/use-permissions';
import { PlanSummaryCard } from '@/components/billing/plan-summary-card';

export default function BillingPage() {
  const canManage = useIsOwner();

  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const assignPlan = useAssignPlan();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your current plan and subscription details.
        </p>
      </div>

      <Separator />

      {subLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : subscription ? (
        <PlanSummaryCard data={subscription} />
      ) : (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No active plan assigned to this organization.
          </p>
        </div>
      )}

      {canManage && plans.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-base font-semibold mb-4">Available plans</h2>
            {plansLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="rounded-lg border p-4 space-y-3">
                    <div>
                      <p className="font-semibold">{plan.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{plan.code}</p>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Up to {plan.maxUsers} users</li>
                      <li>Up to {plan.maxClients} clients</li>
                      <li>Up to {plan.maxOperations} operations</li>
                      <li>Up to {plan.maxIntegrations} integrations</li>
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
                        ? 'Current plan'
                        : 'Switch to this plan'}
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
