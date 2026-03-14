'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface UploadDocumentVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  currentVersion: number;
  onSubmit: (file: File) => void;
  isPending: boolean;
}

export function UploadDocumentVersionDialog({
  open,
  onOpenChange,
  documentName,
  currentVersion,
  onSubmit,
  isPending,
}: UploadDocumentVersionDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  function handleOpenChange(value: boolean) {
    if (!value) setFile(null);
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload new version</DialogTitle>
          <DialogDescription>
            {documentName} — currently v{currentVersion}. A new version v{currentVersion + 1} will
            be created.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            File <span className="text-destructive">*</span>
          </label>
          <input
            type="file"
            className="w-full text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium file:cursor-pointer cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={() => file && onSubmit(file)} disabled={!file || isPending}>
            {isPending ? 'Uploading…' : 'Upload version'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
