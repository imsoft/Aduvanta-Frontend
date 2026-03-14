'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useQuery } from '@tanstack/react-query';
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
import { useOperations } from '@/features/operations/hooks/use-operations';
import { useOrgStore } from '@/store/org.store';
import { apiClient } from '@/lib/api-client';
import type { Client } from '@/features/clients/types/client.types';

interface MemberUser {
  id: string;
  name: string;
  email: string;
}

interface MemberWithUser {
  membership: { id: string; userId: string; role: string };
  user: MemberUser;
}

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

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get<Client[]>('/api/clients', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data;
    },
    enabled: !!activeOrgId,
  });

  const { data: membersRaw = [] } = useQuery<MemberWithUser[]>({
    queryKey: ['members', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get<MemberWithUser[]>('/api/memberships', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data;
    },
    enabled: !!activeOrgId,
  });

  const clientNames = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const userNames = Object.fromEntries(
    membersRaw.map(({ user }) => [user.id, user.name]),
  );

  if (!activeOrgId) {
    return (
      <div className="text-sm text-muted-foreground">
        Select an organization to view operations.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your organization's customs operations
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/operations/new">
            <Plus size={14} />
            New operation
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading operations…</div>
      )}

      {!isLoading && operations.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm font-medium">No operations found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || status !== 'ALL' || priority !== 'ALL'
              ? 'Try adjusting your filters.'
              : 'Create your first operation to get started.'}
          </p>
          {!search && status === 'ALL' && priority === 'ALL' && (
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/operations/new">New operation</Link>
            </Button>
          )}
        </div>
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
