'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { RuleSet } from '@/features/compliance-rule-sets/types/rule-set.types'
import type {
  CreateRuleSetFormData,
  UpdateRuleSetFormData,
} from '@/features/compliance-rule-sets/schemas/rule-set.schemas'

const OPERATION_TYPES = ['IMPORT', 'EXPORT', 'INTERNAL'] as const

interface RuleSetFormProps {
  initialValues?: Partial<RuleSet>
  onSubmit: (data: CreateRuleSetFormData | UpdateRuleSetFormData) => void
  onCancel: () => void
  isPending: boolean
  submitLabel: string
}

export function RuleSetForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: RuleSetFormProps) {
  const t = useTranslations('compliance')
  const tOp = useTranslations('operations')
  const common = useTranslations('common')

  const [values, setValues] = useState({
    name: initialValues?.name ?? '',
    code: initialValues?.code ?? '',
    operationType: initialValues?.operationType ?? 'IMPORT',
    isActive: initialValues?.isActive ?? true,
  })

  function handleSubmit() {
    if (!values.name || !values.code || !values.operationType) return
    onSubmit({
      name: values.name,
      code: values.code.toUpperCase(),
      operationType: values.operationType as 'IMPORT' | 'EXPORT' | 'INTERNAL',
      isActive: values.isActive,
    })
  }

  const isValid = values.name && values.code && /^[A-Z0-9_]+$/.test(values.code.toUpperCase())

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t('ruleSetForm.name')}>
          <input
            className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </Field>
        <Field label={t('ruleSetForm.code')}>
          <input
            className="w-full rounded-none border bg-transparent px-3 py-2 text-sm font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.code}
            onChange={(e) =>
              setValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))
            }
          />
        </Field>
        <Field label={t('ruleSetForm.operationType')}>
          <select
            className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.operationType}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                operationType: e.target.value as typeof values.operationType,
              }))
            }
          >
            {OPERATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {tOp(`types.${type}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('ruleSetForm.active')}>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={values.isActive}
              onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm">
              {t('ruleSetForm.activeHint')}
            </label>
          </div>
        </Field>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          {common('cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid || isPending}>
          {isPending ? common('saving') : submitLabel}
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}
