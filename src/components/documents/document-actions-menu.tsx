'use client';

import { useState } from 'react';
import {
  DotsThree,
  DownloadSimple,
  PencilSimple,
  Upload,
  ClockCounterClockwise,
  Prohibit,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Document } from '@/features/documents/types/document.types';
import type { DocumentCategory } from '@/features/document-categories/types/document-category.types';
import { EditDocumentDialog } from './edit-document-dialog';
import { UploadDocumentVersionDialog } from './upload-document-version-dialog';
import { DocumentVersionsTable } from './document-versions-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { UpdateDocumentFormData } from '@/features/documents/schemas/document.schemas';

interface DocumentActionsMenuProps {
  document: Document;
  categories: DocumentCategory[];
  canManage: boolean;
  onDownload: () => void;
  onEdit: (dto: UpdateDocumentFormData) => void;
  onUploadVersion: (file: File) => void;
  onDeactivate: () => void;
  isEditPending: boolean;
  isVersionPending: boolean;
}

export function DocumentActionsMenu({
  document,
  categories,
  canManage,
  onDownload,
  onEdit,
  onUploadVersion,
  onDeactivate,
  isEditPending,
  isVersionPending,
}: DocumentActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <DotsThree size={16} weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDownload} className="gap-2">
            <DownloadSimple size={14} />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setHistoryOpen(true)} className="gap-2">
            <ClockCounterClockwise size={14} />
            Version history
          </DropdownMenuItem>
          {canManage && document.status === 'ACTIVE' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)} className="gap-2">
                <PencilSimple size={14} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVersionOpen(true)} className="gap-2">
                <Upload size={14} />
                Upload new version
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDeactivate}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Prohibit size={14} />
                Deactivate
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canManage && (
        <>
          <EditDocumentDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            document={document}
            categories={categories}
            onSubmit={(dto) => {
              onEdit(dto);
              setEditOpen(false);
            }}
            isPending={isEditPending}
          />
          <UploadDocumentVersionDialog
            open={versionOpen}
            onOpenChange={setVersionOpen}
            documentName={document.name}
            currentVersion={document.currentVersionNumber}
            onSubmit={(file) => {
              onUploadVersion(file);
              setVersionOpen(false);
            }}
            isPending={isVersionPending}
          />
        </>
      )}

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Version history — {document.name}</DialogTitle>
          </DialogHeader>
          <DocumentVersionsTable documentId={document.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
