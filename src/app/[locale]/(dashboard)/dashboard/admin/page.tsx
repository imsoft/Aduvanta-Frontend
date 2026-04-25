'use client';

import { usePlatformOverview } from '@/features/system-admin/hooks/use-system-admin';
import { Buildings, Users, FileText, ClipboardText, Lightning, ArrowRight } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const inner = (
    <div className="rounded-xl border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold tabular-nums">{value.toLocaleString('es-MX')}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminOverviewPage() {
  const { data, isLoading } = usePlatformOverview();

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Panel de administración</h1>
            <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Métricas globales de toda la plataforma Aduvanta
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
              label="Organizaciones"
              value={data.totalOrganizations}
              icon={Buildings}
              href="/dashboard/admin/organizations"
            />
            <KpiCard
              label="Usuarios"
              value={data.totalUsers}
              icon={Users}
              href="/dashboard/admin/users"
            />
            <KpiCard
              label="Operaciones activas"
              value={data.activeOperations}
              sub={`${data.totalOperations.toLocaleString('es-MX')} totales`}
              icon={FileText}
            />
            <KpiCard
              label="Pedimentos totales"
              value={data.totalEntries}
              sub={`${data.entriesThisMonth} este mes`}
              icon={ClipboardText}
            />
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Ver todas las organizaciones', href: '/dashboard/admin/organizations', desc: `${data.totalOrganizations} organizaciones registradas` },
              { label: 'Ver todos los usuarios', href: '/dashboard/admin/users', desc: `${data.totalUsers} usuarios en la plataforma` },
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
                <p className="text-sm font-medium">Actividad reciente en la plataforma</p>
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
                      {formatDistanceToNow(new Date(evt.createdAt), { addSuffix: true, locale: es })}
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
