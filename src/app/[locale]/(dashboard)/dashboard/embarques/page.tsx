'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Plus, Package } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useOrgStore } from '@/store/org.store';
import { useShipments } from '@/features/shipments/hooks/use-shipments';
import type { ShipmentStatus, ShipmentType } from '@/features/shipments/types/shipment.types';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING: 'Pendiente',
  IN_TRANSIT: 'En tránsito',
  AT_CUSTOMS: 'En aduana',
  PREVIO: 'Previo',
  DISPATCHING: 'En despacho',
  MODULATION: 'Modulación',
  GREEN_LIGHT: 'Luz verde',
  RED_LIGHT: 'Reconocimiento',
  INSPECTION: 'Inspección',
  RELEASED: 'Liberado',
  DELIVERED: 'Entregado',
  HELD: 'Retenido',
  CANCELLED: 'Cancelado',
};

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  IN_TRANSIT: 'bg-blue-50 text-blue-700',
  AT_CUSTOMS: 'bg-blue-50 text-blue-700',
  PREVIO: 'bg-purple-50 text-purple-700',
  DISPATCHING: 'bg-orange-50 text-orange-700',
  MODULATION: 'bg-orange-50 text-orange-700',
  GREEN_LIGHT: 'bg-green-50 text-green-700',
  RED_LIGHT: 'bg-red-50 text-red-700',
  INSPECTION: 'bg-red-50 text-red-700',
  RELEASED: 'bg-green-50 text-green-700',
  DELIVERED: 'bg-green-50 text-green-700',
  HELD: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const TYPE_LABELS: Record<ShipmentType, string> = {
  IMPORT: 'Importación',
  EXPORT: 'Exportación',
  TRANSIT: 'Tránsito',
};

const STATUSES = [
  { value: 'ALL', label: 'Todos los estados' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

const TYPES = [
  { value: 'ALL', label: 'Todos los tipos' },
  { value: 'IMPORT', label: 'Importación' },
  { value: 'EXPORT', label: 'Exportación' },
  { value: 'TRANSIT', label: 'Tránsito' },
];

export default function EmbarquesPage() {
  const { activeOrgId } = useOrgStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = useShipments({
    q: search || undefined,
    status: status === 'ALL' ? undefined : status,
    type: type === 'ALL' ? undefined : type,
    limit,
    offset,
  });

  const shipments = data?.shipments ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  if (!activeOrgId) {
    return (
      <div className="w-full text-sm text-muted-foreground">
        Selecciona una organización para ver los embarques.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Embarques</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seguimiento de embarques de importación, exportación y tránsito
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/embarques/nuevo">
            <Plus size={14} />
            Nuevo embarque
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por tracking, referencia, B/L..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          className="w-full min-w-0 max-w-xs"
        />
        <Select
          value={type}
          onValueChange={(v) => {
            setType(v);
            setOffset(0);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setOffset(0);
          }}
        >
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && shipments.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Package size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">No se encontraron embarques</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || status !== 'ALL' || type !== 'ALL'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Registra el primer embarque para comenzar'}
          </p>
          {!search && status === 'ALL' && type === 'ALL' && (
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/embarques/nuevo">Nuevo embarque</Link>
            </Button>
          )}
        </div>
      )}

      {!isLoading && shipments.length > 0 && (
        <>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Origen → Destino</TableHead>
                  <TableHead>B/L</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-sm font-medium">
                      {s.trackingNumber}
                    </TableCell>
                    <TableCell className="text-sm">
                      {TYPE_LABELS[s.type]}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-xs font-medium',
                          STATUS_COLORS[s.status],
                        )}
                      >
                        {STATUS_LABELS[s.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.clientName ?? s.clientReference ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[s.originCountry, s.destinationCountry]
                        .filter(Boolean)
                        .join(' → ') || '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {s.billOfLading ?? '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString('es-MX')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {offset + 1}–{Math.min(offset + limit, total)} de {total} embarques
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setOffset(offset + limit)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
