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
import type { CreateChargeFormData } from '@/features/operation-charges/schemas/operation-charge.schemas';

interface CreateChargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateChargeFormData) => void;
  isPending: boolean;
}

const EMPTY: CreateChargeFormData = {
  type: '',
  description: '',
  amount: 0,
  currency: 'USD',
};

export function CreateChargeDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateChargeDialogProps) {
  const t = useTranslations('finance');
  const tCommon = useTranslations('common');
  const [values, setValues] = useState<typeof EMPTY>(EMPTY);

  function handleOpenChange(next: boolean) {
    if (!next) setValues(EMPTY);
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!values.type || !values.currency || values.amount <= 0) return;
    onSubmit({
      type: values.type,
      description: values.description || undefined,
      amount: values.amount,
      currency: values.currency,
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dialogs.addCharge')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label={t('fields.typeRequired')}>
            <input
              className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={values.type}
              onChange={(e) => setValues((v) => ({ ...v, type: e.target.value }))}
            />
          </Field>
          <Field label={t('fields.description')}>
            <textarea
              rows={2}
              className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            />
          </Field>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!values.type || !values.currency || values.amount <= 0 || isPending}
          >
            {isPending ? t('dialogs.adding') : t('dialogs.addCharge')}
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
