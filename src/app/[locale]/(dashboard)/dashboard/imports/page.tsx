'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ImportsTable } from '@/components/imports/imports-table';
import { CreateImportDialog } from '@/components/imports/create-import-dialog';
import { useImports, useCreateImport } from '@/features/imports/hooks/use-imports';
import { useCanManage } from '@/hooks/use-permissions';

export default function ImportsPage() {
  const t = useTranslations();
  const canRun = useCanManage();

  const { data: jobs = [], isLoading } = useImports();
  const createImport = useCreateImport();

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('imports.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('imports.description')}
          </p>
        </div>
        {canRun && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            {t('imports.importClients')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : (
        <ImportsTable jobs={jobs} />
      )}

      {canRun && (
        <CreateImportDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={(type, file) =>
            createImport.mutate({ type, file }, { onSuccess: () => setCreateOpen(false) })
          }
          isPending={createImport.isPending}
        />
      )}
    </div>
  );
}
