'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartLine, ArrowsClockwise, Truck, ClipboardText, Package } from '@phosphor-icons/react';
import { useRealtimeEvents, type RealtimeEvent } from '@/hooks/use-realtime-events';
import { useOrgStore } from '@/store/org.store';
import { apiClient } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';

interface MonitorStats {
  pendingEntries: number;
  activeShipments: number;
  pendingOperations: number;
  warehouseItems: number;
}

interface LiveEvent {
  id: string;
  type: string;
  resourceId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

const EVENT_LABELS: Record<string, string> = {
  CUSTOMS_ENTRY_STATUS_CHANGED: 'Pedimento actualizado',
  OPERATION_STATUS_CHANGED: 'Operación actualizada',
  OPERATION_ASSIGNED: 'Operación asignada',
  NEW_NOTIFICATION: 'Nueva notificación',
  SHIPMENT_STATUS_CHANGED: 'Embarque actualizado',
};

const EVENT_COLORS: Record<string, string> = {
  CUSTOMS_ENTRY_STATUS_CHANGED: 'bg-blue-100 text-blue-800',
  OPERATION_STATUS_CHANGED: 'bg-purple-100 text-purple-800',
  OPERATION_ASSIGNED: 'bg-yellow-100 text-yellow-800',
  NEW_NOTIFICATION: 'bg-gray-100 text-gray-800',
  SHIPMENT_STATUS_CHANGED: 'bg-green-100 text-green-800',
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: 'blue' | 'green' | 'yellow' | 'gray';
}) {
  const colorClass =
    accent === 'blue'
      ? 'text-blue-600'
      : accent === 'green'
        ? 'text-green-600'
        : accent === 'yellow'
          ? 'text-yellow-600'
          : 'text-muted-foreground';
  return (
    <div className="border p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={16} className={colorClass} />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-3xl font-mono font-semibold">{value}</p>
    </div>
  );
}

export default function MonitorPage() {
  const { activeOrgId } = useOrgStore();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const { data: stats, isLoading } = useQuery<MonitorStats>({
    queryKey: ['monitor-stats', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/analytics/dashboard', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return {
        pendingEntries: (data.entriesByStatus?.DRAFT ?? 0) + (data.entriesByStatus?.PREVALIDATED ?? 0),
        activeShipments: data.activeOperations ?? 0,
        pendingOperations: data.activeOperations ?? 0,
        warehouseItems: data.warehouseItems ?? 0,
      };
    },
    enabled: !!activeOrgId,
    refetchInterval: 30_000,
  });

  const handleEvent = useCallback((event: RealtimeEvent) => {
    setConnected(true);
    setEvents((prev) => [
      {
        id: crypto.randomUUID(),
        type: event.type,
        resourceId: event.resourceId,
        payload: event.payload,
        timestamp: event.timestamp,
      },
      ...prev.slice(0, 99),
    ]);
  }, []);

  useRealtimeEvents(handleEvent);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monitor de operaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Estado en tiempo real de las operaciones activas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-300'}`}
          />
          <span className="text-xs text-muted-foreground">
            {connected ? 'Conectado' : 'Conectando…'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 border bg-muted/20 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              label="Pedimentos pendientes"
              value={stats?.pendingEntries ?? 0}
              icon={ClipboardText}
              accent="blue"
            />
            <StatCard
              label="Embarques activos"
              value={stats?.activeShipments ?? 0}
              icon={Truck}
              accent="green"
            />
            <StatCard
              label="Operaciones activas"
              value={stats?.pendingOperations ?? 0}
              icon={ArrowsClockwise}
              accent="yellow"
            />
            <StatCard
              label="Items en bodega"
              value={stats?.warehouseItems ?? 0}
              icon={Package}
            />
          </>
        )}
      </div>

      <div className="border">
        <div className="flex items-center gap-2 p-4 border-b">
          <ChartLine size={16} className="text-muted-foreground" />
          <p className="text-sm font-medium">Eventos en tiempo real</p>
          {events.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {events.length}
            </Badge>
          )}
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <ChartLine size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Esperando eventos…</p>
            <p className="text-xs mt-1">
              Los cambios de estado aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <div className="divide-y max-h-[480px] overflow-y-auto">
            {events.map((e) => (
              <div key={e.id} className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors">
                <span
                  className={`mt-0.5 inline-flex items-center px-2 py-0.5 text-xs font-medium shrink-0 ${EVENT_COLORS[e.type] ?? 'bg-gray-100 text-gray-800'}`}
                >
                  {EVENT_LABELS[e.type] ?? e.type}
                </span>
                <p className="text-xs text-muted-foreground font-mono flex-1 truncate">
                  {e.resourceId}
                </p>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Date(e.timestamp).toLocaleTimeString('es-MX')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
