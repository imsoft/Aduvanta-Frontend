'use client';

import { useTranslations } from 'next-intl';
import { DownloadSimple } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePortalDocuments, usePortalDocumentDownload } from '@/features/portal/hooks/use-portal';
import type { Document } from '@/features/portal/types/portal.types';
import { EmptyState } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/loading-skeletons';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PortalDocumentsSectionProps {
  operationId: string;
}

export function PortalDocumentsSection({ operationId }: PortalDocumentsSectionProps) {
  const t = useTranslations('portalDocs');
  const { data: documents = [], isLoading } = usePortalDocuments(operationId);
  const download = usePortalDocumentDownload();

  async function handleDownload(doc: Document) {
    const result = await download.mutateAsync(doc.id);
    window.open(result.url, '_blank', 'noopener,noreferrer');
  }

  if (isLoading) {
    return <TableSkeleton rows={3} columns={5} />;
  }

  if (documents.length === 0) {
    return <EmptyState title={t('empty')} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('columns.name')}</TableHead>
          <TableHead>{t('columns.type')}</TableHead>
          <TableHead>{t('columns.size')}</TableHead>
          <TableHead>{t('columns.uploaded')}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium text-sm">{doc.name}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{doc.mimeType}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatBytes(doc.sizeInBytes)}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(doc.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => handleDownload(doc)}
                disabled={download.isPending}
              >
                <DownloadSimple size={13} />
                {t('download')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
