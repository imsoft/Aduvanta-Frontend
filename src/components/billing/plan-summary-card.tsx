'use client';

import type { SubscriptionWithPlan } from '@/features/subscriptions/types/subscription.types';

interface PlanSummaryCardProps {
  data: SubscriptionWithPlan;
}

export function PlanSummaryCard({ data }: PlanSummaryCardProps) {
  const { subscription, plan } = data;

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Current plan
          </p>
          <h3 className="text-2xl font-semibold mt-0.5">{plan.name}</h3>
          <p className="text-sm text-muted-foreground font-mono">{plan.code}</p>
        </div>
        <StatusBadge status={subscription.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <LimitItem label="Max users" value={plan.maxUsers} />
        <LimitItem label="Max clients" value={plan.maxClients} />
        <LimitItem label="Max operations" value={plan.maxOperations} />
        <LimitItem label="Max integrations" value={plan.maxIntegrations} />
        <LimitItem
          label="Max storage"
          value={formatBytes(plan.maxStorageBytes)}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Active since{' '}
        {new Date(subscription.startedAt).toLocaleDateString()}
        {subscription.endsAt &&
          ` · Expires ${new Date(subscription.endsAt).toLocaleDateString()}`}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    EXPIRED: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? colors.EXPIRED}`}
    >
      {status}
    </span>
  );
}

function LimitItem({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value.toLocaleString()}</p>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) {
    return `${(bytes / 1_073_741_824).toFixed(0)} GB`;
  }
  if (bytes >= 1_048_576) {
    return `${(bytes / 1_048_576).toFixed(0)} MB`;
  }
  return `${(bytes / 1024).toFixed(0)} KB`;
}
