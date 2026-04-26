'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { MagnifyingGlass, Warning, CheckCircle } from '@phosphor-icons/react';
import { parseApiDate } from '@/lib/date-utils';
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
import { useCustomsInspections } from '@/features/customs-inspections/hooks/use-customs-inspections';

const INSPECTION_TYPE_LABELS: Record<string, string> = {
  DOCUMENTAL: 'Documental',
  FISICO_ALEATORIO: 'Físico aleatorio',
  FISICO_SELECTIVO: 'Físico selectivo',
  FISICO_TOTAL: 'Físico total',
  RECONOCIMIENTO_ADUANERO: 'Reconocimiento aduanero',
};

const RESULT_LABELS: Record<string, string> = {
  CONFORMING: 'Conforme',
  DISCREPANCY_FOUND: 'Discrepancia',
  PENALTY_APPLIED: 'Sanción aplicada',
  SAMPLES_TAKEN: 'Muestras tomadas',
  CLEARED: 'Liberado',
};

const RESULT_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  CONFORMING: 'secondary',
  DISCREPANCY_FOUND: 'outline',
  PENALTY_APPLIED: 'destructive',
  SAMPLES_TAKEN: 'default',
  CLEARED: 'secondary',
};

function SemaphoreBadge({ color }: { color: string | null }) {
  if (!color) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${color === 'GREEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {color === 'GREEN' ? <CheckCircle size={12} /> : <Warning size={12} />}
      {color === 'GREEN' ? 'Verde' : 'Rojo'}
    </span>
  );
}

export default function InspeccionesPage() {
  const locale = useLocale();
  const [result, setResult] = useState('ALL');
  const [semaphoreColor, setSemaphoreColor] = useState('ALL');
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data, isLoading } = useCustomsInspections({
    result: result === 'ALL' ? undefined : result,
    semaphoreColor: semaphoreColor === 'ALL' ? undefined : semaphoreColor,
    limit,
    offset: page * limit,
  });

  const inspections = data?.inspections ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const redCount = inspections.filter((i) => i.semaphoreColor === 'RED').length;
  const discrepancyCount = inspections.filter((i) => i.discrepanciesFound).length;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Inspecciones Aduaneras
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reconocimiento aduanero, semáforo fiscal e inspecciones físicas
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Total inspecciones</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Semáforo verde</p>
          <p className="text-2xl font-semibold mt-1 text-green-700">
            {inspections.filter((i) => i.semaphoreColor === 'GREEN').length}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Semáforo rojo</p>
          <p className="text-2xl font-semibold mt-1 text-red-700">{redCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Con discrepancias</p>
          <p className="text-2xl font-semibold mt-1 text-orange-700">{discrepancyCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={semaphoreColor} onValueChange={(v) => { setSemaphoreColor(v); setPage(0); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los semáforos</SelectItem>
            <SelectItem value="GREEN">Verde</SelectItem>
            <SelectItem value="RED">Rojo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={result} onValueChange={(v) => { setResult(v); setPage(0); }}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los resultados</SelectItem>
            {Object.entries(RESULT_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && inspections.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <MagnifyingGlass size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Sin inspecciones registradas</p>
          <p className="text-sm text-muted-foreground mt-1">
            Las inspecciones y resultados de semáforo aparecerán aquí
          </p>
        </div>
      )}

      {!isLoading && inspections.length > 0 && (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semáforo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Aduana</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>No. Acta</TableHead>
                  <TableHead>Discrepancias</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((insp) => (
                  <TableRow key={insp.id}>
                    <TableCell>
                      <SemaphoreBadge color={insp.semaphoreColor} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {INSPECTION_TYPE_LABELS[insp.inspectionType] ?? insp.inspectionType}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {insp.customsOffice ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {insp.inspectorName ?? '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {insp.actaNumber ?? '—'}
                    </TableCell>
                    <TableCell>
                      {insp.discrepanciesFound ? (
                        <span className="text-xs text-red-700 font-medium flex items-center gap-1">
                          <Warning size={12} /> Sí
                        </span>
                      ) : (
                        <span className="text-xs text-green-700">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {insp.result ? (
                        <Badge variant={RESULT_VARIANT[insp.result] ?? 'outline'}>
                          {RESULT_LABELS[insp.result] ?? insp.result}
                        </Badge>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {insp.inspectionDate
                        ? parseApiDate(insp.inspectionDate).toLocaleDateString(locale)
                        : new Date(insp.createdAt).toLocaleDateString(locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{total} inspecciones en total</span>
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
