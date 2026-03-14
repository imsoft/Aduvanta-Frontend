'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation'
import { Buildings } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { useOrgStore, type OrgOption } from '@/store/org.store';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

async function fetchOrganizations(): Promise<OrgOption[]> {
  const { data } = await apiClient.get<OrgOption[]>('/api/organizations');
  return data;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const { data: session } = useSession();
  const { activeOrgId, organizations, setOrganizations, setActiveOrg } = useOrgStore();

  const { data: orgs, isSuccess } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  useEffect(() => {
    if (!orgs) return;
    setOrganizations(orgs);
    if (!activeOrgId && orgs.length > 0) {
      setActiveOrg(orgs[0].id);
    }
    if (isSuccess && orgs.length === 0) {
      router.replace('/dashboard/organizations/new');
    }
  }, [orgs, isSuccess, activeOrgId, setOrganizations, setActiveOrg, router]);

  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const user = session?.user;

  if (isSuccess && orgs && orgs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {activeOrg ? activeOrg.name : t('title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('welcomeBack', { name: user?.name ?? user?.email ?? '' })}
        </p>
      </div>

      {!activeOrg && organizations.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Buildings size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('noOrganization')}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('createFirstOrg')}
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/dashboard/organizations/new">{t('createOrganization')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
