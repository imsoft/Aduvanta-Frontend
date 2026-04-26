'use client';

import { usePlatformOverview } from '@/features/system-admin/hooks/use-system-admin';
import { Buildings, Users, FileText, ClipboardText, Lightning, ArrowRight } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ElementType;
  href?: string;
}) {
  const locale = useLocale();
  const inner = (
    <div className="rounded-xl border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold tabular-nums">{value.toLocaleString(locale)}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminOverviewPage() {
  const { data, isLoading } = usePlatformOverview();
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{t('overview.title')}</h1>
            <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('overview.description')}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              label={t('overview.organizations')}
              value={data.totalOrganizations}
              icon={Buildings}
              href="/dashboard/admin/organizations"
            />
            <KpiCard
              label={t('overview.users')}
              value={data.totalUsers}
              icon={Users}
              href="/dashboard/admin/users"
            />
            <KpiCard
              label={t('overview.activeOperations')}
              value={data.activeOperations}
              sub={`${data.totalOperations.toLocaleString(locale)} ${t('overview.total')}`}
              icon={FileText}
            />
            <KpiCard
              label={t('overview.totalEntries')}
              value={data.totalEntries}
              sub={`${data.entriesThisMonth} ${t('overview.thisMonth')}`}
              icon={ClipboardText}
            />
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: t('overview.allOrganizations'), href: '/dashboard/admin/organizations', desc: t('overview.organizationsRegistered', { count: data.totalOrganizations }) },
              { label: t('overview.allUsers'), href: '/dashboard/admin/users', desc: t('overview.usersOnPlatform', { count: data.totalUsers }) },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-xl border bg-card px-5 py-4 hover:bg-accent/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{link.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                </div>
                <ArrowRight size={16} className="text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>

          {/* Recent activity */}
          {data.recentActivity.length > 0 && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b bg-muted/20">
                <p className="text-sm font-medium">{t('overview.recentActivity')}</p>
              </div>
              <ul className="divide-y">
                {data.recentActivity.map((evt, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <Lightning size={13} className="text-muted-foreground shrink-0" />
                      <span className="font-mono text-xs text-muted-foreground truncate">{evt.action}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs truncate">{evt.resource}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {formatDistanceToNow(new Date(evt.createdAt), { addSuffix: true, locale: dateLocale })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
