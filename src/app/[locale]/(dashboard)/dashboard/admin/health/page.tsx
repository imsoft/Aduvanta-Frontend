'use client';

import { useQuery } from '@tanstack/react-query';
import { usePlatformOverview } from '@/features/system-admin/hooks/use-system-admin';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import {
  CheckCircle,
  WarningCircle,
  XCircle,
  Database,
  Lightning,
  Globe,
  ArrowClockwise,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface HealthStatus {
  status: 'ok' | 'error';
  info?: Record<string, { status: string }>;
  error?: Record<string, { status: string; message?: string }>;
  details?: Record<string, { status: string; message?: string }>;
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'up' || status === 'ok') return <CheckCircle size={16} className="text-green-500" weight="fill" />;
  if (status === 'down' || status === 'error') return <XCircle size={16} className="text-red-500" weight="fill" />;
  return <WarningCircle size={16} className="text-yellow-500" weight="fill" />;
}

const SERVICE_ICONS: Record<string, typeof Database> = {
  database: Database,
  redis: Lightning,
};

export default function AdminHealthPage() {
  const { data: health, isLoading, refetch, dataUpdatedAt } = useQuery<HealthStatus>({
    queryKey: ['system-admin', 'health'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/health');
      return data as HealthStatus;
    },
    refetchInterval: 1000 * 30,
    staleTime: 1000 * 15,
  });

  const { data: overview } = usePlatformOverview();

  const allDetails = { ...(health?.info ?? {}), ...(health?.error ?? {}) };
  const isHealthy = health?.status === 'ok';

  return (
    <div className="w-full space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Estado del Sistema</h1>
            <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Infraestructura, servicios y métricas de la plataforma
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <ArrowClockwise size={14} className="mr-1.5" />
          Actualizar
        </Button>
      </div>

      {/* Overall status */}
      <div className={`rounded-xl border p-5 flex items-center gap-4 ${
        isLoading ? 'bg-muted/20' :
        isHealthy ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30' :
        'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
      }`}>
        {isLoading ? (
          <div className="h-10 w-10 rounded-full bg-muted/40 animate-pulse shrink-0" />
        ) : isHealthy ? (
          <CheckCircle size={40} className="text-green-500 shrink-0" weight="fill" />
        ) : (
          <XCircle size={40} className="text-red-500 shrink-0" weight="fill" />
        )}
        <div>
          <p className="font-semibold text-lg">
            {isLoading ? 'Verificando...' : isHealthy ? 'Todos los sistemas operacionales' : 'Degradación detectada'}
          </p>
          {dataUpdatedAt > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Última verificación: {new Date(dataUpdatedAt).toLocaleTimeString('es-MX')}
            </p>
          )}
        </div>
      </div>

      {/* Service checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-4 h-20 bg-muted/20 animate-pulse" />
            ))
          : Object.entries(allDetails).map(([name, detail]) => {
              const Icon = SERVICE_ICONS[name] ?? Globe;
              const msg = 'message' in detail ? detail.message : undefined;
              return (
                <div key={name} className="rounded-xl border p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium capitalize">{name}</p>
                    {msg && (
                      <p className="text-xs text-muted-foreground truncate">{msg}</p>
                    )}
                  </div>
                  <StatusIcon status={detail.status} />
                </div>
              );
            })}
      </div>

      {/* Platform KPIs */}
      {overview && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
            Métricas de plataforma
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { label: 'Organizaciones', value: overview.totalOrganizations },
              { label: 'Usuarios', value: overview.totalUsers },
              { label: 'Operaciones totales', value: overview.totalOperations },
              { label: 'Op. activas', value: overview.activeOperations },
              { label: 'Pedimentos totales', value: overview.totalEntries },
              { label: 'Pedimentos este mes', value: overview.entriesThisMonth },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold font-mono mt-1">{value.toLocaleString('es-MX')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {overview?.recentActivity && overview.recentActivity.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
            Actividad reciente
          </p>
          <div className="rounded-xl border divide-y">
            {overview.recentActivity.map((event, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="font-mono text-xs text-muted-foreground w-24 shrink-0 truncate">
                  {event.resource}
                </span>
                <span className="flex-1">{event.action}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(event.createdAt).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
