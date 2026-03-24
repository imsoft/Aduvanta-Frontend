'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation'
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IntegrationsTable } from '@/components/integrations/integrations-table';
import { IntegrationForm } from '@/components/integrations/integration-form';
import {
  useIntegrations,
  useCreateIntegration,
  useDeactivateIntegration,
} from '@/features/integrations/hooks/use-integrations';
import { useCanManage } from '@/hooks/use-permissions';
import type { CreateIntegrationFormData } from '@/features/integrations/schemas/integration.schemas';

export default function IntegrationsPage() {
  const t = useTranslations();
  const router = useRouter();
  const canManage = useCanManage();

  const { data: integrations = [], isLoading } = useIntegrations();
  const createIntegration = useCreateIntegration();
  const deactivateIntegration = useDeactivateIntegration();

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('integrations.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('integrations.description')}
          </p>
        </div>
        {canManage && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            {t('integrations.new')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : (
        <IntegrationsTable
          integrations={integrations}
          canManage={canManage}
          onDeactivate={(id) => deactivateIntegration.mutate(id)}
          isDeactivatePending={deactivateIntegration.isPending}
        />
      )}

      {canManage && (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('integrations.newTitle')}</DialogTitle>
            </DialogHeader>
            <IntegrationForm
              onSubmit={(dto) =>
                createIntegration.mutate(dto as CreateIntegrationFormData, {
                  onSuccess: (created) => {
                    setCreateOpen(false);
                    router.push(`/dashboard/integrations/${created.id}`);
                  },
                })
              }
              onCancel={() => setCreateOpen(false)}
              isPending={createIntegration.isPending}
              submitLabel={t('integrations.createIntegration')}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
