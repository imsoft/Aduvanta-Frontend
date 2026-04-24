'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  Buildings,
  ClipboardText,
  CurrencyDollar,
  Warning,
  TrendUp,
  Package,
  IdentificationCard,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { useOrgStore, type OrgOption } from '@/store/org.store';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

async function fetchOrganizations(): Promise<OrgOption[]> {
  const { data } = await apiClient.get<OrgOption[]>('/api/organizations');
  return data;
}

interface DashboardMetrics {
  activeOperations: number;
  entriesThisMonth: number;
  pendingPayments: number;
  pendingPaymentsAmount: string;
  expiringRegistries: number;
  warehouseItems: number;
  entriesByStatus: {
    DRAFT: number;
    PREVALIDATED: number;
    VALIDATED: number;
    PAID: number;
    DISPATCHED: number;
    RELEASED: number;
  };
}

function MetricCard({
  label,
  value,
  sub,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'green' | 'red' | 'yellow' | 'blue';
  href?: string;
}) {
  const colorClass =
    accent === 'green'
      ? 'text-green-700'
      : accent === 'red'
        ? 'text-red-700'
        : accent === 'yellow'
          ? 'text-yellow-700'
          : accent === 'blue'
            ? 'text-blue-700'
            : '';

  const card = (
    <div className={`rounded-lg border p-4 ${href ? 'hover:bg-muted/30 transition-colors' : ''}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-semibold font-mono mt-1 ${colorClass}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
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

  const { data: metrics } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/analytics/dashboard', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data;
    },
    enabled: !!activeOrgId,
  });

  if (isSuccess && orgs && orgs.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
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

      {activeOrg && metrics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <MetricCard
              label="Operaciones activas"
              value={metrics.activeOperations}
              href="/dashboard/operations"
            />
            <MetricCard
              label="Pedimentos este mes"
              value={metrics.entriesThisMonth}
              href="/dashboard/pedimentos"
            />
            <MetricCard
              label="Pagos pendientes"
              value={metrics.pendingPayments}
              sub={metrics.pendingPaymentsAmount
                ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                    parseFloat(metrics.pendingPaymentsAmount),
                  )
                : undefined}
              accent={metrics.pendingPayments > 0 ? 'yellow' : undefined}
              href="/dashboard/tesoreria/cuentas"
            />
            <MetricCard
              label="Padrones por vencer"
              value={metrics.expiringRegistries}
              accent={metrics.expiringRegistries > 0 ? 'red' : undefined}
              href="/dashboard/padron/importadores"
            />
            <MetricCard
              label="Items en bodega"
              value={metrics.warehouseItems}
              href="/dashboard/bodega/inventario"
            />
            <MetricCard
              label="En despacho"
              value={metrics.entriesByStatus?.DISPATCHED ?? 0}
              accent="blue"
              href="/dashboard/pedimentos"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pedimentos by status */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardText size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Estado de pedimentos</p>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'DRAFT', label: 'Borrador', color: 'bg-gray-200' },
                  { key: 'PREVALIDATED', label: 'Prevalidado', color: 'bg-yellow-300' },
                  { key: 'VALIDATED', label: 'Validado', color: 'bg-blue-300' },
                  { key: 'PAID', label: 'Pagado', color: 'bg-purple-300' },
                  { key: 'DISPATCHED', label: 'Despachado', color: 'bg-orange-300' },
                  { key: 'RELEASED', label: 'Liberado', color: 'bg-green-400' },
                ].map(({ key, label, color }) => {
                  const count = metrics.entriesByStatus?.[key as keyof typeof metrics.entriesByStatus] ?? 0;
                  const total = Object.values(metrics.entriesByStatus ?? {}).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <p className="text-xs text-muted-foreground w-24 shrink-0">{label}</p>
                      <div className="flex-1 rounded-full bg-muted h-2 overflow-hidden">
                        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs font-mono w-8 text-right">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <TrendUp size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Accesos rápidos</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/dashboard/pedimentos/nuevo', label: 'Nuevo pedimento', icon: ClipboardText },
                  { href: '/dashboard/clasificacion', label: 'Clasificar fracción', icon: IdentificationCard },
                  { href: '/dashboard/tesoreria/cuentas', label: 'Cuenta corriente', icon: CurrencyDollar },
                  { href: '/dashboard/bodega/inventario', label: 'Inventario bodega', icon: Package },
                  { href: '/dashboard/padron/importadores', label: 'Padrón importadores', icon: IdentificationCard },
                  { href: '/dashboard/inspecciones', label: 'Inspecciones', icon: Warning },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-muted/30 transition-colors"
                  >
                    <Icon size={14} className="text-muted-foreground shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
