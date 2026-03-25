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
import { OperationsTable } from '@/components/operations/operations-table';
import { EmptyState } from '@/components/ui/empty-state';
import { useOperations } from '@/features/operations/hooks/use-operations';
import { useClients } from '@/features/clients/hooks/use-clients';
import { useMembers } from '@/hooks/use-members';
import { useOrgStore } from '@/store/org.store';

export default function OperationsPage() {
  const t = useTranslations()
  const { activeOrgId } = useOrgStore()
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');

  const { data: operations = [], isLoading } = useOperations({
    search: search || undefined,
    status: status === 'ALL' ? undefined : status,
    priority: priority === 'ALL' ? undefined : priority,
  });

  const { data: clients = [] } = useClients();
  const { data: membersRaw = [] } = useMembers();

  const clientNames = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const userNames = Object.fromEntries(
    membersRaw.map(({ user }) => [user.id, user.name]),
  );

  if (!activeOrgId) {
    return (
      <div className="w-full text-sm text-muted-foreground">
        {t('operations.selectOrg')}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('operations.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('operations.description')}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/operations/new">
            <Plus size={14} />
            {t('operations.new')}
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-w-0 max-w-xs sm:max-w-sm"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('operations.allStatuses')}</SelectItem>
            <SelectItem value="OPEN">{t('operations.open')}</SelectItem>
            <SelectItem value="IN_PROGRESS">{t('operations.inProgress')}</SelectItem>
            <SelectItem value="ON_HOLD">{t('operations.onHold')}</SelectItem>
            <SelectItem value="COMPLETED">{t('operations.completed')}</SelectItem>
            <SelectItem value="CANCELLED">{t('operations.cancelled')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('operations.allPriorities')}</SelectItem>
            <SelectItem value="LOW">{t('operations.low')}</SelectItem>
            <SelectItem value="MEDIUM">{t('operations.medium')}</SelectItem>
            <SelectItem value="HIGH">{t('operations.high')}</SelectItem>
            <SelectItem value="URGENT">{t('operations.urgent')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">{t('operations.loading')}</div>
      )}

      {!isLoading && operations.length === 0 && (
        <EmptyState
          title={t('operations.empty')}
          description={
            search || status !== 'ALL' || priority !== 'ALL'
              ? t('operations.emptyFiltered')
              : t('operations.emptyDescription')
          }
          action={
            !search && status === 'ALL' && priority === 'ALL' ? (
              <Button asChild size="sm">
                <Link href="/dashboard/operations/new">{t('operations.new')}</Link>
              </Button>
            ) : undefined
          }
        />
      )}

      {!isLoading && operations.length > 0 && (
        <OperationsTable
          operations={operations}
          clientNames={clientNames}
          userNames={userNames}
        />
      )}
    </div>
  );
}
