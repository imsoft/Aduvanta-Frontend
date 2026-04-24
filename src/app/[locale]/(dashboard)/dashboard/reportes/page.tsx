'use client';

import { useState } from 'react';
import { ChartBar, Download, FileCsv, FileXls } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type ReportType = 'BALANZA_MERCANCIAS' | 'PEDIMENTOS_PERIODO' | 'CONTRIBUCIONES' | 'OPERACIONES_CLIENTE';

const REPORT_DEFINITIONS = [
  {
    type: 'BALANZA_MERCANCIAS' as ReportType,
    title: 'Balanza de mercancías',
    description: 'Total de importaciones y exportaciones en el período, por fracción arancelaria.',
  },
  {
    type: 'PEDIMENTOS_PERIODO' as ReportType,
    title: 'Pedimentos por período',
    description: 'Listado de pedimentos tramitados en el período con sus contribuciones y valores.',
  },
  {
    type: 'CONTRIBUCIONES' as ReportType,
    title: 'Contribuciones pagadas',
    description: 'Resumen de IGI, IVA, DTA y otras contribuciones pagadas por pedimento.',
  },
  {
    type: 'OPERACIONES_CLIENTE' as ReportType,
    title: 'Operaciones por cliente',
    description: 'Número de operaciones, pedimentos, valores y contribuciones agrupados por cliente.',
  },
];

interface ReportRow {
  [key: string]: string | number | null;
}

const formatMXN = (v: string | number | null) =>
  v != null
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
        typeof v === 'string' ? parseFloat(v) : v,
      )
    : '—';

export default function ReportesPage() {
  const { activeOrgId } = useOrgStore();
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [dateFrom, setDateFrom] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [regime, setRegime] = useState('ALL');
  const [runQuery, setRunQuery] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['report', activeOrgId, selectedType, dateFrom, dateTo, regime],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/reports', {
        params: {
          type: selectedType,
          dateFrom,
          dateTo,
          regime: regime === 'ALL' ? undefined : regime,
        },
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data as { columns: string[]; rows: ReportRow[]; total: number };
    },
    enabled: !!activeOrgId && !!selectedType && runQuery,
  });

  const columns = data?.columns ?? [];
  const rows = data?.rows ?? [];

  const handleGenerate = () => {
    setRunQuery(true);
  };

  const handleDownloadCsv = async () => {
    if (!selectedType || !activeOrgId) return;
    const response = await apiClient.get('/api/reports/export', {
      params: { type: selectedType, dateFrom, dateTo, regime: regime === 'ALL' ? undefined : regime, format: 'csv' },
      headers: { 'x-organization-id': activeOrgId },
      responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${selectedType?.toLowerCase()}-${dateFrom}-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Balanza de mercancías, pedimentos, contribuciones y análisis operacionales
        </p>
      </div>

      {/* Report type selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {REPORT_DEFINITIONS.map((def) => (
          <button
            key={def.type}
            onClick={() => { setSelectedType(def.type); setRunQuery(false); }}
            className={`text-left rounded-lg border p-4 transition-colors hover:bg-muted/30 ${selectedType === def.type ? 'border-primary bg-primary/5' : ''}`}
          >
            <p className="font-medium text-sm">{def.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{def.description}</p>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-sm font-medium">
            Parámetros del reporte:{' '}
            <span className="text-muted-foreground font-normal">
              {REPORT_DEFINITIONS.find((d) => d.type === selectedType)?.title}
            </span>
          </p>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">Desde</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setRunQuery(false); }}
                className="w-40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Hasta</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setRunQuery(false); }}
                className="w-40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Régimen</Label>
              <Select value={regime} onValueChange={(v) => { setRegime(v); setRunQuery(false); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="IMD">IMD — Definitiva importación</SelectItem>
                  <SelectItem value="EXD">EXD — Definitiva exportación</SelectItem>
                  <SelectItem value="IMT">IMT — Temporal importación</SelectItem>
                  <SelectItem value="EXT">EXT — Temporal exportación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading || isFetching}>
              <ChartBar size={14} className="mr-1.5" />
              {isLoading || isFetching ? 'Generando...' : 'Generar reporte'}
            </Button>
            {rows.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
                <FileCsv size={14} className="mr-1.5" />
                Exportar CSV
              </Button>
            )}
          </div>
        </div>
      )}

      {(isLoading || isFetching) && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && !isFetching && runQuery && rows.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <ChartBar size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Sin datos para el período seleccionado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajusta las fechas o el régimen e intenta de nuevo
          </p>
        </div>
      )}

      {!isLoading && !isFetching && rows.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{data?.total} registros encontrados</p>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col} className="text-xs uppercase tracking-wide">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col} className="text-sm font-mono">
                        {row[col] ?? '—'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {!selectedType && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <ChartBar size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Selecciona un tipo de reporte</p>
          <p className="text-sm text-muted-foreground mt-1">
            Elige uno de los reportes disponibles y configura los parámetros
          </p>
        </div>
      )}
    </div>
  );
}
