'use client';

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Buildings, Plus } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { apiClient } from '@/lib/api-client';
import { useOrgStore, type OrgOption } from '@/store/org.store';

async function fetchOrganizations(): Promise<OrgOption[]> {
  const { data } = await apiClient.get<OrgOption[]>('/api/organizations');
  return data;
}

function getRoleLabel(role: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    OWNER: t('roles.owner'),
    ADMIN: t('roles.admin'),
    MEMBER: t('roles.member'),
  };
  return map[role] ?? role;
}

export default function OrganizationsPage() {
  const t = useTranslations();
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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('organizations.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('organizations.description')}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/organizations/new">
            <Plus size={14} />
            {t('organizations.new')}
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
      )}

      {!isLoading && orgs.length === 0 && (
        <EmptyState
          title={t('organizations.empty')}
          description={t('organizations.emptyDescription')}
          icon={<Buildings size={32} />}
          action={
            <Button asChild size="sm">
              <Link href="/dashboard/organizations/new">{t('organizations.createOrganization')}</Link>
            </Button>
          }
        />
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
                {getRoleLabel(org.role, t)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
