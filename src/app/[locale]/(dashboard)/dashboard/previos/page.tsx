'use client';

import { useState } from 'react';
import { Clipboard, CheckCircle, XCircle } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
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
import { useOrgStore } from '@/store/org.store';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface CustomsPrevio {
  id: string;
  operationId: string | null;
  entryId: string | null;
  previoType: string;
  status: string;
  scheduledDate: string | null;
  completedAt: string | null;
  warehouseLocation: string | null;
  declaredPackages: number | null;
  foundPackages: number | null;
  declaredWeightKg: string | null;
  foundWeightKg: string | null;
  sealIntact: boolean | null;
  photographsTaken: boolean | null;
  discrepanciesFound: boolean;
  responsibleName: string | null;
  notes: string | null;
  createdAt: string;
}

const PREVIO_TYPE_LABELS: Record<string, string> = {
  FULL: 'Completo',
  PARTIAL: 'Parcial',
  SAMPLING: 'Por muestreo',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En proceso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  PENDING: 'outline',
  IN_PROGRESS: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

export default function PreviosPage() {
  const { activeOrgId } = useOrgStore();
  const [status, setStatus] = useState('ALL');
  const [previoType, setPrevioType] = useState('ALL');
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data, isLoading } = useQuery({
    queryKey: ['customs-previos', activeOrgId, status, previoType, page],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/customs-previos', {
        params: {
          status: status === 'ALL' ? undefined : status,
          previoType: previoType === 'ALL' ? undefined : previoType,
          limit,
          offset: page * limit,
        },
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data as { previos: CustomsPrevio[]; total: number };
    },
    enabled: !!activeOrgId,
  });

  const previos = data?.previos ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const pendingCount = previos.filter((p) => p.status === 'PENDING').length;
  const inProgressCount = previos.filter((p) => p.status === 'IN_PROGRESS').length;
  const discrepancyCount = previos.filter((p) => p.discrepanciesFound).length;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Previos Aduanales</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pre-inspección física de mercancías antes de la presentación del pedimento
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Total previos</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Pendientes</p>
          <p className="text-2xl font-semibold mt-1 text-orange-600">{pendingCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">En proceso</p>
          <p className="text-2xl font-semibold mt-1 text-blue-700">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Con discrepancias</p>
          <p className="text-2xl font-semibold mt-1 text-red-700">{discrepancyCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={previoType} onValueChange={(v) => { setPrevioType(v); setPage(0); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los tipos</SelectItem>
            {Object.entries(PREVIO_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && previos.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Clipboard size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Sin previos registrados</p>
          <p className="text-sm text-muted-foreground mt-1">
            Los previos aduanales se registran desde el expediente de la operación
          </p>
        </div>
      )}

      {!isLoading && previos.length > 0 && (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead className="text-right">Bultos dec.</TableHead>
                  <TableHead className="text-right">Bultos enc.</TableHead>
                  <TableHead>Sellos</TableHead>
                  <TableHead>Discrepancias</TableHead>
                  <TableHead>Fecha prog.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">
                      {PREVIO_TYPE_LABELS[p.previoType] ?? p.previoType}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status] ?? 'outline'}>
                        {STATUS_LABELS[p.status] ?? p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                      {p.warehouseLocation ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.responsibleName ?? '—'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {p.declaredPackages ?? '—'}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-sm ${p.foundPackages != null && p.declaredPackages != null && p.foundPackages !== p.declaredPackages ? 'text-red-700 font-semibold' : ''}`}>
                      {p.foundPackages ?? '—'}
                    </TableCell>
                    <TableCell>
                      {p.sealIntact === null ? (
                        <span className="text-muted-foreground text-xs">—</span>
                      ) : p.sealIntact ? (
                        <CheckCircle size={14} className="text-green-700" />
                      ) : (
                        <XCircle size={14} className="text-red-700" />
                      )}
                    </TableCell>
                    <TableCell>
                      {p.discrepanciesFound ? (
                        <span className="text-xs text-red-700 font-medium">Sí</span>
                      ) : (
                        <span className="text-xs text-green-700">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.scheduledDate
                        ? new Date(p.scheduledDate).toLocaleDateString('es-MX')
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{total} previos en total</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-2 py-1">{page + 1} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
