'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientsTable } from '@/components/clients/clients-table';
import { useClients } from '@/features/clients/hooks/use-clients';
import { useOrgStore } from '@/store/org.store';

export default function ClientsPage() {
  const t = useTranslations()
  const { activeOrgId } = useOrgStore()
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const { data: clients = [], isLoading } = useClients({
    search: search || undefined,
    status: status === 'ALL' ? undefined : status,
  });

  if (!activeOrgId) {
    return (
      <div className="text-sm text-muted-foreground">
        {t('clients.selectOrg')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('clients.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('clients.description')}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/clients/new">
            <Plus size={14} />
            {t('clients.newClient')}
          </Link>
        </Button>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder={t('placeholders.searchClients')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('clients.allStatuses')}</SelectItem>
            <SelectItem value="ACTIVE">{t('clients.active')}</SelectItem>
            <SelectItem value="INACTIVE">{t('clients.inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading clients…</div>
      )}

      {!isLoading && clients.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm font-medium">No clients found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || status !== 'ACTIVE'
              ? 'Try adjusting your filters.'
              : 'Create your first client to get started.'}
          </p>
          {!search && status === 'ACTIVE' && (
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/clients/new">New client</Link>
            </Button>
          )}
        </div>
      )}

      {!isLoading && clients.length > 0 && <ClientsTable clients={clients} />}
    </div>
  );
}
