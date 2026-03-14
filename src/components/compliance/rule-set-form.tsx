'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { RuleSet } from '@/features/compliance-rule-sets/types/rule-set.types';
import type {
  CreateRuleSetFormData,
  UpdateRuleSetFormData,
} from '@/features/compliance-rule-sets/schemas/rule-set.schemas';

const OPERATION_TYPES = ['IMPORT', 'EXPORT', 'INTERNAL'] as const;

interface RuleSetFormProps {
  initialValues?: Partial<RuleSet>;
  onSubmit: (data: CreateRuleSetFormData | UpdateRuleSetFormData) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

export function RuleSetForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: RuleSetFormProps) {
  const [values, setValues] = useState({
    name: initialValues?.name ?? '',
    code: initialValues?.code ?? '',
    operationType: initialValues?.operationType ?? 'IMPORT',
    isActive: initialValues?.isActive ?? true,
  });

  function handleSubmit() {
    if (!values.name || !values.code || !values.operationType) return;
    onSubmit({
      name: values.name,
      code: values.code.toUpperCase(),
      operationType: values.operationType as 'IMPORT' | 'EXPORT' | 'INTERNAL',
      isActive: values.isActive,
    });
  }

  const isValid = values.name && values.code && /^[A-Z0-9_]+$/.test(values.code.toUpperCase());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name *">
          <input
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="e.g. Import Standard"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </Field>
        <Field label="Code * (uppercase, no spaces)">
          <input
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="e.g. IMPORT_STD"
            value={values.code}
            onChange={(e) =>
              setValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))
            }
          />
        </Field>
        <Field label="Operation type *">
          <select
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.operationType}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                operationType: e.target.value as typeof values.operationType,
              }))
            }
          >
            {OPERATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Active">
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={values.isActive}
              onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm">
              Rule set is active
            </label>
          </div>
        </Field>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid || isPending}>
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </div>
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
