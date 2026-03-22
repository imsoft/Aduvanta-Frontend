'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { IntegrationForm } from '@/components/integrations/integration-form';
import { IntegrationDeliveriesTable } from '@/components/integrations/integration-deliveries-table';
import { InfoField } from '@/components/ui/info-field';
import {
  useIntegration,
  useUpdateIntegration,
} from '@/features/integrations/hooks/use-integrations';
import {
  useIntegrationDeliveries,
  useRetryDelivery,
} from '@/features/integration-deliveries/hooks/use-deliveries';
import { useCanManage } from '@/hooks/use-permissions';
import type { UpdateIntegrationFormData } from '@/features/integrations/schemas/integration.schemas';

export default function IntegrationDetailPage() {
  const { integrationId } = useParams<{ integrationId: string }>();
  const router = useRouter();
  const canManage = useCanManage();

  const { data: integration, isLoading } = useIntegration(integrationId);
  const { data: deliveries = [], isLoading: isLoadingDeliveries } =
    useIntegrationDeliveries(integrationId);

  const updateIntegration = useUpdateIntegration(integrationId);
  const retryDelivery = useRetryDelivery(integrationId);

  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!integration) {
    return <p className="text-sm text-destructive">Integration not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.push('/dashboard/integrations')}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{integration.name}</h1>
          <p className="text-sm text-muted-foreground">
            {integration.provider} ·{' '}
            <span
              className={
                integration.status === 'ACTIVE'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              }
            >
              {integration.status}
            </span>
          </p>
        </div>
      </div>

      {/* Integration info / edit */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Configuration
          </h2>
          {canManage && !editing && (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <IntegrationForm
            initialValues={integration}
            onSubmit={(dto) =>
              updateIntegration.mutate(dto as UpdateIntegrationFormData, {
                onSuccess: () => setEditing(false),
              })
            }
            onCancel={() => setEditing(false)}
            isPending={updateIntegration.isPending}
            submitLabel="Save changes"
            isEdit
          />
        ) : (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoField label="Target URL" value={integration.targetUrl} />
            <InfoField
              label="Secret"
              value={integration.secretEncrypted ? '***' : 'Not set'}
            />
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Event types
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {integration.eventTypes.split(',').map((evt) => (
                  <span
                    key={evt}
                    className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono"
                  >
                    {evt.trim()}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* Delivery logs */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Delivery logs
        </h2>
        {isLoadingDeliveries ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <IntegrationDeliveriesTable
            deliveries={deliveries}
            canRetry={canManage}
            onRetry={(id) => retryDelivery.mutate(id)}
            isRetryPending={retryDelivery.isPending}
          />
        )}
      </section>
    </div>
  );
}

