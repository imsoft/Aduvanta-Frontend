'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { CreateExportJobFormData } from '@/features/exports/schemas/export-job.schemas';

const EXPORT_TYPES = ['CLIENTS', 'OPERATIONS', 'FINANCE'] as const;

interface CreateExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateExportJobFormData) => void;
  isPending: boolean;
}

export function CreateExportDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateExportDialogProps) {
  const [type, setType] = useState<'CLIENTS' | 'OPERATIONS' | 'FINANCE'>('CLIENTS');

  function handleOpenChange(next: boolean) {
    if (!next) setType('CLIENTS');
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New export</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Export type *
            </label>
            <select
              className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              {EXPORT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            The export will be generated as a CSV file. Download it once it completes.
          </p>
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
            onClick={() => onSubmit({ type })}
            disabled={isPending}
          >
            {isPending ? 'Generating…' : 'Generate export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
