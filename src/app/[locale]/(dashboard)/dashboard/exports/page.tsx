'use client';

import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ExportsTable } from '@/components/exports/exports-table';
import { CreateExportDialog } from '@/components/exports/create-export-dialog';
import { useExports, useCreateExport, useExportDownloadUrl } from '@/features/exports/hooks/use-exports';
import { useOrgStore } from '@/store/org.store';

export default function ExportsPage() {
  const { organizations, activeOrgId } = useOrgStore();
  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const canGenerate = activeOrg?.role === 'OWNER' || activeOrg?.role === 'ADMIN';

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
          <h1 className="text-2xl font-semibold tracking-tight">Exports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate and download CSV exports of your organization data.
          </p>
        </div>
        {canGenerate && (
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            New export
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
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
