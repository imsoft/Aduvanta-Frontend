'use client';

import { Separator } from '@/components/ui/separator';
import { useUsage } from '@/features/usage/hooks/use-usage';
import { UsageMetricsCards } from '@/components/billing/usage-metrics-cards';

export default function UsagePage() {
  const { data: usage, isLoading } = useUsage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Current resource usage for your organization.
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : usage ? (
        <div className="space-y-4">
          {usage.planName && (
            <p className="text-sm text-muted-foreground">
              Plan: <span className="font-medium text-foreground">{usage.planName}</span>
              {usage.planCode && (
                <span className="font-mono text-xs ml-1">({usage.planCode})</span>
              )}
            </p>
          )}
          <UsageMetricsCards usage={usage} />
          {!usage.limits && (
            <p className="text-xs text-muted-foreground">
              No active plan limits configured. Assign a plan to enforce usage limits.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No usage data available.</p>
      )}
    </div>
  );
}
