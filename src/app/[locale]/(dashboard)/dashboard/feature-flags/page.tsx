'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useFeatureFlags, useCreateFeatureFlag } from '@/features/feature-flags/hooks/use-feature-flags';
import { FeatureFlagsTable } from '@/components/billing/feature-flags-table';
import { useOrgStore } from '@/store/org.store';

interface CreateFlagForm {
  key: string;
  description: string;
  isEnabled: boolean;
}

export default function FeatureFlagsPage() {
  const { organizations, activeOrgId } = useOrgStore();
  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const canManage = activeOrg?.role === 'OWNER';

  const { data: flags = [], isLoading } = useFeatureFlags();
  const createFlag = useCreateFeatureFlag();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateFlagForm>({
    key: '',
    description: '',
    isEnabled: false,
  });

  function handleCreate() {
    createFlag.mutate(
      {
        key: form.key,
        description: form.description || undefined,
        isEnabled: form.isEnabled,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({ key: '', description: '', isEnabled: false });
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feature flags</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enable or disable features for your organization.
        </p>
      </div>

      <Separator />

      {showForm && canManage && (
        <div className="rounded-lg border p-4 space-y-4">
          <h3 className="text-sm font-semibold">New feature flag</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Key
              </label>
              <input
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                value={form.key}
                onChange={(e) => setForm((v) => ({ ...v, key: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </label>
              <input
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.description}
                onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isEnabled}
                onChange={(e) => setForm((v) => ({ ...v, isEnabled: e.target.checked }))}
                className="h-4 w-4 rounded border"
              />
              Enable immediately
            </label>
          </div>
          <div className="flex gap-3">
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!form.key || createFlag.isPending}
            >
              {createFlag.isPending ? 'Creating…' : 'Create flag'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <FeatureFlagsTable
          flags={flags}
          canManage={canManage}
          onCreateClick={() => setShowForm(true)}
        />
      )}
    </div>
  );
}
