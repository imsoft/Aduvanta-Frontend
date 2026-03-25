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
import { EmptyState } from '@/components/ui/empty-state';
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
        <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
      )}

      {!isLoading && clients.length === 0 && (
        <EmptyState
          title={t('clients.notFound')}
          description={
            search || status !== 'ACTIVE'
              ? t('clients.emptyFiltered')
              : t('clients.emptyDescription')
          }
          action={
            !search && status === 'ACTIVE' ? (
              <Button asChild size="sm">
                <Link href="/dashboard/clients/new">{t('clients.createClient')}</Link>
              </Button>
            ) : undefined
          }
        />
      )}

      {!isLoading && clients.length > 0 && <ClientsTable clients={clients} />}
    </div>
  );
}
