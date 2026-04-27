'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { WEBHOOK_EVENT_TYPES } from '@/features/integrations/schemas/integration.schemas';
import type { Integration } from '@/features/integrations/types/integration.types';
import type {
  CreateIntegrationFormData,
  UpdateIntegrationFormData,
} from '@/features/integrations/schemas/integration.schemas';

interface IntegrationFormProps {
  initialValues?: Partial<Integration>;
  onSubmit: (data: CreateIntegrationFormData | UpdateIntegrationFormData) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  isEdit?: boolean;
}

export function IntegrationForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
  isEdit = false,
}: IntegrationFormProps) {
  const t = useTranslations('integrations')
  const tAuth = useTranslations('auth')
  const common = useTranslations('common')
  const existingEventTypes = initialValues?.eventTypes
    ? initialValues.eventTypes.split(',').map((e) => e.trim())
    : [];

  const [name, setName] = useState(initialValues?.name ?? '');
  const [targetUrl, setTargetUrl] = useState(initialValues?.targetUrl ?? '');
  const [secret, setSecret] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(
    new Set(existingEventTypes),
  );

  function toggleEvent(event: string) {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(event)) {
        next.delete(event);
      } else {
        next.add(event);
      }
      return next;
    });
  }

  function handleSubmit() {
    if (!name || selectedEvents.size === 0) return;
    if (!isEdit && !targetUrl) return;

    const eventTypes = Array.from(selectedEvents) as CreateIntegrationFormData['eventTypes'];

    if (isEdit) {
      const dto: UpdateIntegrationFormData = {
        name,
        eventTypes,
      };
      if (targetUrl) dto.targetUrl = targetUrl;
      if (secret) dto.secret = secret;
      onSubmit(dto);
    } else {
      onSubmit({
        name,
        provider: 'WEBHOOK',
        targetUrl,
        eventTypes,
        secret: secret || undefined,
      });
    }
  }

  const isValid = name.trim() && selectedEvents.size > 0 && (isEdit || targetUrl.trim());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t('form.name')}>
          <input
            className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label={isEdit ? t('form.targetUrlEdit') : t('form.targetUrl')}>
          <input
            type="url"
            className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
        </Field>
        <Field label={isEdit ? t('form.secretKeep') : t('form.secretOptional')}>
          <PasswordInput
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoComplete="off"
            ariaLabelShow={tAuth('showPassword')}
            ariaLabelHide={tAuth('hidePassword')}
          />
        </Field>
      </div>

      <Field label={t('form.eventTypes')}>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {WEBHOOK_EVENT_TYPES.map((event) => (
            <label key={event} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedEvents.has(event)}
                onChange={() => toggleEvent(event)}
              />
              <span className="text-sm font-mono">{event}</span>
            </label>
          ))}
        </div>
      </Field>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          {common('cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid || isPending}>
          {isPending ? common('saving') : submitLabel}
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
