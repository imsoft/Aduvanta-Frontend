'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Upload } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DocumentStatusBadge } from './document-status-badge';
import { DocumentCategoryBadge } from './document-category-badge';
import { DocumentActionsMenu } from './document-actions-menu';
import { UploadDocumentDialog } from './upload-document-dialog';
import {
  useOperationDocuments,
  useUploadDocument,
  useUpdateDocument,
  useDeactivateDocument,
  useUploadDocumentVersion,
  useDocumentDownloadUrl,
} from '@/features/documents/hooks/use-documents';
import { useDocumentCategories } from '@/features/document-categories/hooks/use-document-categories';
import type { Document } from '@/features/documents/types/document.types';
import type { UpdateDocumentFormData } from '@/features/documents/schemas/document.schemas';
import type { DocumentCategory } from '@/features/document-categories/types/document-category.types';
import { EmptyState } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/loading-skeletons';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface OperationDocumentsSectionProps {
  operationId: string;
  canManage: boolean;
}

export function OperationDocumentsSection({
  operationId,
  canManage,
}: OperationDocumentsSectionProps) {
  const t = useTranslations('operationDocuments');
  const [uploadOpen, setUploadOpen] = useState(false);

  const { data: documents = [], isLoading } = useOperationDocuments(operationId);
  const { data: categories = [] } = useDocumentCategories();

  const uploadDocument = useUploadDocument(operationId);
  const downloadUrl = useDocumentDownloadUrl();

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  async function handleDownload(doc: Document) {
    const result = await downloadUrl.mutateAsync(doc.id);
    window.open(result.url, '_blank', 'noopener,noreferrer');
  }

  if (isLoading) {
    return <TableSkeleton rows={3} columns={5} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{t('title')}</h2>
        {canManage && (
          <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)} className="gap-2">
            <Upload size={14} />
            {t('upload')}
          </Button>
        )}
      </div>

      {documents.length === 0 ? (
        <EmptyState title={t('empty')} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('columns.name')}</TableHead>
              <TableHead>{t('columns.category')}</TableHead>
              <TableHead>{t('columns.version')}</TableHead>
              <TableHead>{t('columns.size')}</TableHead>
              <TableHead>{t('columns.status')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                categories={categories}
                categoryMap={categoryMap}
                canManage={canManage}
                operationId={operationId}
                onDownload={() => handleDownload(doc)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {canManage && (
        <UploadDocumentDialog
          open={uploadOpen}
          onOpenChange={(v) => {
            setUploadOpen(v);
          }}
          categories={categories}
          onSubmit={(file, meta) => {
            uploadDocument.mutate(
              { file, meta },
              { onSuccess: () => setUploadOpen(false) },
            );
          }}
          isPending={uploadDocument.isPending}
        />
      )}
    </div>
  );
}

function DocumentRow({
  doc,
  categories,
  categoryMap,
  canManage,
  operationId,
  onDownload,
}: {
  doc: Document;
  categories: DocumentCategory[];
  categoryMap: Record<string, { name: string; code: string }>;
  canManage: boolean;
  operationId: string;
  onDownload: () => void;
}) {
  const updateDocument = useUpdateDocument(doc.id, operationId);
  const uploadVersion = useUploadDocumentVersion(doc.id, operationId);
  const deactivateDocument = useDeactivateDocument(operationId);

  return (
    <TableRow>
      <TableCell className="font-medium text-sm">{doc.name}</TableCell>
      <TableCell>
        <DocumentCategoryBadge category={doc.categoryId ? categoryMap[doc.categoryId] : null} />
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        v{doc.currentVersionNumber}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {formatBytes(doc.sizeInBytes)}
      </TableCell>
      <TableCell>
        <DocumentStatusBadge status={doc.status} />
      </TableCell>
      <TableCell className="text-right">
        <DocumentActionsMenu
          document={doc}
          categories={categories ?? []}
          canManage={canManage}
          onDownload={onDownload}
          onEdit={(dto: UpdateDocumentFormData) => updateDocument.mutate(dto)}
          onUploadVersion={(file: File) => uploadVersion.mutate(file)}
          onDeactivate={() => deactivateDocument.mutate(doc.id)}
          isEditPending={updateDocument.isPending}
          isVersionPending={uploadVersion.isPending}
        />
      </TableCell>
    </TableRow>
  );
}
