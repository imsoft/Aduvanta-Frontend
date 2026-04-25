'use client';

import { useBillingSummary } from '@/features/system-admin/hooks/use-system-admin';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  TRIALING: 'bg-blue-100 text-blue-700',
  PAST_DUE: 'bg-orange-100 text-orange-700',
  CANCELLED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activa',
  TRIALING: 'Trial',
  PAST_DUE: 'Vencida',
  CANCELLED: 'Cancelada',
  EXPIRED: 'Expirada',
};

const fmtMXN = (v: string | null) =>
  v ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseFloat(v)) : '—';

export default function AdminSuscripcionesPage() {
  const { data, isLoading } = useBillingSummary();

  const activeCount = data?.byStatus.find((s) => s.status === 'ACTIVE')?.count ?? 0;
  const trialCount = data?.byStatus.find((s) => s.status === 'TRIALING')?.count ?? 0;
  const pastDueCount = data?.byStatus.find((s) => s.status === 'PAST_DUE')?.count ?? 0;

  return (
    <div className="w-full space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Suscripciones</h1>
          <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Planes activos, trials y estado de facturación por organización
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Total suscripciones</p>
          <p className="text-2xl font-semibold font-mono mt-1">
            {isLoading ? '—' : (data?.subscriptions.length ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Activas</p>
          <p className="text-2xl font-semibold font-mono mt-1 text-green-700">{isLoading ? '—' : activeCount}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">En trial</p>
          <p className="text-2xl font-semibold font-mono mt-1 text-blue-700">{isLoading ? '—' : trialCount}</p>
        </div>
        <div className={`rounded-xl border p-4 ${pastDueCount > 0 ? 'border-orange-200 bg-orange-50' : ''}`}>
          <p className="text-xs text-muted-foreground">Vencidas</p>
          <p className={`text-2xl font-semibold font-mono mt-1 ${pastDueCount > 0 ? 'text-orange-700' : ''}`}>
            {isLoading ? '—' : pastDueCount}
          </p>
        </div>
      </div>

      {/* By plan */}
      {!isLoading && data && data.byPlan.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Por plan</p>
          <div className="flex flex-wrap gap-3">
            {data.byPlan.map((p) => (
              <div key={p.planCode} className="rounded-xl border px-5 py-3 flex items-center gap-3">
                <p className="text-sm font-medium">{p.planName ?? p.planCode ?? '—'}</p>
                <span className="text-2xl font-semibold font-mono text-primary">{p.count}</span>
                <p className="text-xs text-muted-foreground">orgs.</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription list */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20">
          <p className="text-sm font-medium">Detalle de suscripciones</p>
        </div>

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 px-5 flex items-center gap-3">
                <div className="h-4 w-40 rounded bg-muted/40 animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted/30 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{sub.organizationName ?? sub.organizationId}</p>
                    <span className="text-xs text-muted-foreground font-mono">{sub.organizationSlug}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${STATUS_COLORS[sub.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                    {sub.cancelAtPeriodEnd && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-orange-100 text-orange-700">
                        Cancela al vencer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sub.planName ?? '—'} · {sub.billingInterval === 'year' ? 'Anual' : 'Mensual'}
                    {sub.status === 'TRIALING' && sub.trialEndsAt && (
                      <> · Trial termina {format(new Date(sub.trialEndsAt), 'dd MMM yyyy', { locale: es })}</>
                    )}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                  <div className="text-right">
                    <p className="font-mono text-sm text-foreground">
                      {fmtMXN(sub.billingInterval === 'year' ? sub.priceYearly : sub.priceMonthly)}
                    </p>
                    <p className="text-[10px]">/{sub.billingInterval === 'year' ? 'año' : 'mes'}</p>
                  </div>
                  {sub.currentPeriodEnd && (
                    <div className="text-right">
                      <p>Período</p>
                      <p>{format(new Date(sub.currentPeriodEnd), 'dd MMM yyyy', { locale: es })}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {data?.subscriptions.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">No hay suscripciones</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
