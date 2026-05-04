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
  Truck,
  ShieldWarning,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { useOrgStore, type OrgOption } from '@/store/org.store';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useIsSystemAdmin } from '@/features/system-admin/hooks/use-system-admin';

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

const EMPTY_METRICS: DashboardMetrics = {
  activeOperations: 0,
  entriesThisMonth: 0,
  pendingPayments: 0,
  pendingPaymentsAmount: '0',
  expiringRegistries: 0,
  warehouseItems: 0,
  entriesByStatus: { DRAFT: 0, PREVALIDATED: 0, VALIDATED: 0, PAID: 0, DISPATCHED: 0, RELEASED: 0 },
};

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
  const { data: adminStatus, isSuccess: adminChecked } = useIsSystemAdmin();

  const { data: orgs, isSuccess } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    enabled: adminChecked && !adminStatus?.isSystemAdmin,
  });

  useEffect(() => {
    if (adminChecked && adminStatus?.isSystemAdmin) {
      router.replace('/dashboard/admin');
      return;
    }
    if (!orgs) return;
    setOrganizations(orgs);
    if (!activeOrgId && orgs.length > 0) {
      setActiveOrg(orgs[0].id);
    }
    if (isSuccess && orgs.length === 0) {
      router.replace('/dashboard/organizations/new');
    }
  }, [orgs, isSuccess, activeOrgId, setOrganizations, setActiveOrg, router, adminStatus, adminChecked]);

  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const user = session?.user;

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/analytics/dashboard', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data;
    },
    enabled: !!activeOrgId,
    retry: 1,
  });

  if (adminStatus?.isSystemAdmin) return null;
  if (isSuccess && orgs && orgs.length === 0) return null;

  const m = metrics ?? EMPTY_METRICS;

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

      {activeOrg && (
        <>
          {metricsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg border bg-muted/20 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <MetricCard
                label="Operaciones activas"
                value={m.activeOperations}
                href="/dashboard/operations"
              />
              <MetricCard
                label="Pedimentos este mes"
                value={m.entriesThisMonth}
                href="/dashboard/pedimentos"
              />
              <MetricCard
                label="Pagos pendientes"
                value={m.pendingPayments}
                sub={
                  m.pendingPaymentsAmount && parseFloat(m.pendingPaymentsAmount) > 0
                    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                        parseFloat(m.pendingPaymentsAmount),
                      )
                    : undefined
                }
                accent={m.pendingPayments > 0 ? 'yellow' : undefined}
                href="/dashboard/tesoreria/cuentas"
              />
              <MetricCard
                label="Padrones por vencer"
                value={m.expiringRegistries}
                accent={m.expiringRegistries > 0 ? 'red' : undefined}
                href="/dashboard/padron/importadores"
              />
              <MetricCard
                label="Items en bodega"
                value={m.warehouseItems}
                href="/dashboard/bodega/inventario"
              />
              <MetricCard
                label="En despacho"
                value={m.entriesByStatus?.DISPATCHED ?? 0}
                accent="blue"
                href="/dashboard/pedimentos"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  const count = m.entriesByStatus?.[key as keyof typeof m.entriesByStatus] ?? 0;
                  const total = Object.values(m.entriesByStatus ?? {}).reduce((a, b) => a + b, 0);
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

            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <TrendUp size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Accesos rápidos</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/dashboard/pedimentos/nuevo', label: 'Nuevo pedimento', icon: ClipboardText },
                  { href: '/dashboard/embarques', label: 'Embarques', icon: Truck },
                  { href: '/dashboard/clasificacion', label: 'Clasificar fracción', icon: IdentificationCard },
                  { href: '/dashboard/tesoreria/cuentas', label: 'Cuenta corriente', icon: CurrencyDollar },
                  { href: '/dashboard/padron/listas-negras', label: 'Consultar RFC SAT', icon: ShieldWarning },
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
