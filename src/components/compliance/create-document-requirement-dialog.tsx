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
import type { DocumentCategory } from '@/features/document-categories/types/document-category.types';
import type { CreateDocumentRequirementFormData } from '@/features/compliance-document-requirements/schemas/document-requirement.schemas';

interface CreateDocumentRequirementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: DocumentCategory[];
  existingCategoryIds: string[];
  onSubmit: (data: CreateDocumentRequirementFormData) => void;
  isPending: boolean;
}

export function CreateDocumentRequirementDialog({
  open,
  onOpenChange,
  categories,
  existingCategoryIds,
  onSubmit,
  isPending,
}: CreateDocumentRequirementDialogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  const available = categories.filter(
    (c) => !existingCategoryIds.includes(c.id),
  );

  function handleOpenChange(next: boolean) {
    if (!next) {
      setSelectedCategoryId('');
      setIsRequired(true);
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!selectedCategoryId) return;
    onSubmit({ documentCategoryId: selectedCategoryId, isRequired });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add document requirement</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Document category *">
            <select
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Select a category…</option>
              {available.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.code})
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="isRequired" className="text-sm">
              Mark as required
            </label>
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
            onClick={handleSubmit}
            disabled={!selectedCategoryId || isPending}
          >
            {isPending ? 'Adding…' : 'Add requirement'}
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
