'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ExportsTable } from '@/components/exports/exports-table';
import { CreateExportDialog } from '@/components/exports/create-export-dialog';
import { useExports, useCreateExport, useExportDownloadUrl } from '@/features/exports/hooks/use-exports';
import { useCanManage } from '@/hooks/use-permissions';

export default function ExportsPage() {
  const t = useTranslations();
  const canGenerate = useCanManage();

  const { data: jobs = [], isLoading } = useExports();
  const createExport = useCreateExport();

  const [createOpen, setCreateOpen] = useState(false);
  const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null);

  const downloadUrl = useExportDownloadUrl(downloadingJobId ?? '');

  async function handleDownload(jobId: string) {
    setDownloadingJobId(jobId);
    downloadUrl.mutate(undefined, {
      onSuccess: ({ url }) => {
        window.open(url, '_blank');
        setDownloadingJobId(null);
      },
      onSettled: () => setDownloadingJobId(null),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('exports.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('exports.description')}
          </p>
        </div>
        {canGenerate && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            {t('exports.new')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : (
        <ExportsTable
          jobs={jobs}
          onDownload={handleDownload}
          isDownloadPending={downloadUrl.isPending}
        />
      )}

      {canGenerate && (
        <CreateExportDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={(dto) =>
            createExport.mutate(dto, { onSuccess: () => setCreateOpen(false) })
          }
          isPending={createExport.isPending}
        />
      )}
    </div>
  );
}
