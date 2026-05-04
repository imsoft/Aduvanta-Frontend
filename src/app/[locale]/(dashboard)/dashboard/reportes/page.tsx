'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChartBar, FileCsv } from '@phosphor-icons/react';
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
import { useOrgStore } from '@/store/org.store';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type ReportType = 'BALANZA_MERCANCIAS' | 'PEDIMENTOS_PERIODO' | 'CONTRIBUCIONES' | 'OPERACIONES_CLIENTE';

const REPORT_TYPE_KEYS: ReportType[] = ['BALANZA_MERCANCIAS', 'PEDIMENTOS_PERIODO', 'CONTRIBUCIONES', 'OPERACIONES_CLIENTE'];
const REGIME_KEYS = ['IMD', 'EXD', 'IMT', 'EXT'] as const;

interface ReportRow {
  [key: string]: string | number | null;
}

export default function ReportesPage() {
  const t = useTranslations('reports');
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
        <h1 className="text-2xl font-semibold tracking-tight">{t('pageTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('pageDescription')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {REPORT_TYPE_KEYS.map((type) => (
          <button
            key={type}
            onClick={() => { setSelectedType(type); setRunQuery(false); }}
            className={`text-left rounded-lg border p-4 transition-colors hover:bg-muted/30 ${selectedType === type ? 'border-primary bg-primary/5' : ''}`}
          >
            <p className="font-medium text-sm">{t(`reportTypes.${type}.title`)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t(`reportTypes.${type}.description`)}</p>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-sm font-medium">
            {t('params')}{' '}
            <span className="text-muted-foreground font-normal">
              {t(`reportTypes.${selectedType}.title`)}
            </span>
          </p>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('from')}</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setRunQuery(false); }}
                className="w-40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('to')}</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setRunQuery(false); }}
                className="w-40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('regime')}</Label>
              <Select value={regime} onValueChange={(v) => { setRegime(v); setRunQuery(false); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t('allRegimes')}</SelectItem>
                  {REGIME_KEYS.map((k) => (
                    <SelectItem key={k} value={k}>{t(`regimes.${k}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setRunQuery(true)} disabled={isLoading || isFetching}>
              <ChartBar size={14} className="mr-1.5" />
              {isLoading || isFetching ? t('generating') : t('generate')}
            </Button>
            {rows.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
                <FileCsv size={14} className="mr-1.5" />
                {t('exportCsv')}
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
          <p className="text-sm font-medium">{t('noData')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('noDataHint')}</p>
        </div>
      )}

      {!isLoading && !isFetching && rows.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t('recordsFound', { total: data?.total ?? 0 })}</p>
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
          <p className="text-sm font-medium">{t('selectReport')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('selectReportHint')}</p>
        </div>
      )}
    </div>
  );
}
