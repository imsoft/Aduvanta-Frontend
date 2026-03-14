'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CreateImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (type: 'CLIENTS', file: File) => void;
  isPending: boolean;
}

export function CreateImportDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Import clients</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with columns: <span className="font-mono">name, taxId, email, phone</span>. Only <span className="font-mono">name</span> is required.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              CSV file *
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="w-full text-sm text-muted-foreground file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:text-xs file:font-medium file:cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => file && onSubmit('CLIENTS', file)}
            disabled={!file || isPending}
          >
            {isPending ? 'Importing…' : 'Start import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
