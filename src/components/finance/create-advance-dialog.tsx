'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { CreateAdvanceFormData } from '@/features/operation-advances/schemas/operation-advance.schemas';

interface CreateAdvanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAdvanceFormData) => void;
  isPending: boolean;
}

const today = () => new Date().toISOString().split('T')[0];

const EMPTY = (): CreateAdvanceFormData => ({
  amount: 0,
  currency: 'USD',
  reference: '',
  notes: '',
  receivedAt: today(),
});

export function CreateAdvanceDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateAdvanceDialogProps) {
  const t = useTranslations('finance');
  const tCommon = useTranslations('common');
  const [values, setValues] = useState<CreateAdvanceFormData>(EMPTY());

  function handleOpenChange(next: boolean) {
    if (!next) setValues(EMPTY());
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!values.currency || values.amount <= 0 || !values.receivedAt) return;
    onSubmit({
      amount: values.amount,
      currency: values.currency,
      reference: values.reference || undefined,
      notes: values.notes || undefined,
      receivedAt: values.receivedAt,
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dialogs.registerAdvance')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('fields.amountRequired')}>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={values.amount === 0 ? '' : values.amount}
                onChange={(e) =>
                  setValues((v) => ({ ...v, amount: parseFloat(e.target.value) || 0 }))
                }
              />
            </Field>
            <Field label={t('fields.currencyRequired')}>
              <input
                className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={values.currency}
                onChange={(e) =>
                  setValues((v) => ({ ...v, currency: e.target.value.toUpperCase() }))
                }
              />
            </Field>
          </div>
          <Field label={t('fields.receivedAtRequired')}>
            <input
              type="date"
              className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={values.receivedAt}
              onChange={(e) => setValues((v) => ({ ...v, receivedAt: e.target.value }))}
            />
          </Field>
          <Field label={t('fields.reference')}>
            <input
              className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={values.reference}
              onChange={(e) => setValues((v) => ({ ...v, reference: e.target.value }))}
            />
          </Field>
          <Field label={t('fields.notes')}>
            <textarea
              rows={2}
              className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={values.notes}
              onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!values.currency || values.amount <= 0 || !values.receivedAt || isPending}
          >
            {isPending ? t('dialogs.registering') : t('dialogs.registerAdvance')}
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
