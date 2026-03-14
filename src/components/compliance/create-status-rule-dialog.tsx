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
import type { CreateStatusRuleFormData } from '@/features/compliance-status-rules/schemas/status-rule.schemas';
import type { OperationStatus } from '@/features/compliance-status-rules/types/status-rule.types';

const STATUSES: OperationStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
];

interface CreateStatusRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingPairs: { fromStatus: string; toStatus: string }[];
  onSubmit: (data: CreateStatusRuleFormData) => void;
  isPending: boolean;
}

export function CreateStatusRuleDialog({
  open,
  onOpenChange,
  existingPairs,
  onSubmit,
  isPending,
}: CreateStatusRuleDialogProps) {
  const [fromStatus, setFromStatus] = useState<OperationStatus>('OPEN');
  const [toStatus, setToStatus] = useState<OperationStatus>('IN_PROGRESS');
  const [requiresDocs, setRequiresDocs] = useState(false);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setFromStatus('OPEN');
      setToStatus('IN_PROGRESS');
      setRequiresDocs(false);
    }
    onOpenChange(next);
  }

  const isDuplicate = existingPairs.some(
    (p) => p.fromStatus === fromStatus && p.toStatus === toStatus,
  );

  function handleSubmit() {
    if (isDuplicate) return;
    onSubmit({ fromStatus, toStatus, requiresAllRequiredDocuments: requiresDocs });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add status transition rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="From status">
              <select
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={fromStatus}
                onChange={(e) => setFromStatus(e.target.value as OperationStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="To status">
              <select
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={toStatus}
                onChange={(e) => setToStatus(e.target.value as OperationStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiresDocs"
              checked={requiresDocs}
              onChange={(e) => setRequiresDocs(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="requiresDocs" className="text-sm">
              Requires all required documents
            </label>
          </div>
          {isDuplicate && (
            <p className="text-xs text-destructive">
              This transition already exists in this rule set.
            </p>
          )}
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
            onClick={handleSubmit}
            disabled={isDuplicate || isPending}
          >
            {isPending ? 'Adding…' : 'Add rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
