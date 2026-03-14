'use client';

import { Link } from '@/i18n/navigation'
import { useQuery } from '@tanstack/react-query';
import { Buildings, Plus } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useOrgStore, type OrgOption } from '@/store/org.store';

async function fetchOrganizations(): Promise<OrgOption[]> {
  const { data } = await apiClient.get<OrgOption[]>('/api/organizations');
  return data;
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
};

export default function OrganizationsPage() {
  const { activeOrgId, setOrganizations, setActiveOrg } = useOrgStore();

  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  useEffect(() => {
    if (orgs.length === 0) return;
    setOrganizations(orgs);
    if (!activeOrgId) {
      setActiveOrg(orgs[0].id);
    }
  }, [orgs, activeOrgId, setOrganizations, setActiveOrg]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Workspaces you belong to
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/organizations/new">
            <Plus size={14} />
            New organization
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading…</div>
      )}

      {!isLoading && orgs.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Buildings size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">No organizations yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first organization to get started.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/dashboard/organizations/new">Create organization</Link>
          </Button>
        </div>
      )}

      {!isLoading && orgs.length > 0 && (
        <div className="divide-y rounded-lg border">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-sm font-medium uppercase">
                  {org.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{org.name}</p>
                  <p className="text-xs text-muted-foreground">{org.slug}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {ROLE_LABELS[org.role] ?? org.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
