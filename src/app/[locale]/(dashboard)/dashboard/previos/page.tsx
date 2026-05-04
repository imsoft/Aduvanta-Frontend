'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  PENDING: 'outline',
  IN_PROGRESS: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

const PREVIO_TYPE_KEYS = ['FULL', 'PARTIAL', 'SAMPLING'] as const;
const STATUS_KEYS = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export default function PreviosPage() {
  const t = useTranslations('previos');
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
        <h1 className="text-2xl font-semibold tracking-tight">{t('pageTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('pageDescription')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('total')}</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('pending')}</p>
          <p className="text-2xl font-semibold mt-1 text-orange-600">{pendingCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('inProgress')}</p>
          <p className="text-2xl font-semibold mt-1 text-blue-700">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('withDiscrepancies')}</p>
          <p className="text-2xl font-semibold mt-1 text-red-700">{discrepancyCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allStatuses')}</SelectItem>
            {STATUS_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{t(`statuses.${k}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={previoType} onValueChange={(v) => { setPrevioType(v); setPage(0); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allTypes')}</SelectItem>
            {PREVIO_TYPE_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{t(`types.${k}`)}</SelectItem>
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
          <p className="text-sm font-medium">{t('empty')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('emptyHint')}</p>
        </div>
      )}

      {!isLoading && previos.length > 0 && (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('colType')}</TableHead>
                  <TableHead>{t('colStatus')}</TableHead>
                  <TableHead>{t('colLocation')}</TableHead>
                  <TableHead>{t('colResponsible')}</TableHead>
                  <TableHead className="text-right">{t('colDeclaredPackages')}</TableHead>
                  <TableHead className="text-right">{t('colFoundPackages')}</TableHead>
                  <TableHead>{t('colSeals')}</TableHead>
                  <TableHead>{t('colDiscrepancies')}</TableHead>
                  <TableHead>{t('colScheduledDate')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">
                      {t(`types.${p.previoType}` as any, { default: p.previoType })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status] ?? 'outline'}>
                        {t(`statuses.${p.status}` as any, { default: p.status })}
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
                        <span className="text-xs text-red-700 font-medium">{t('yes')}</span>
                      ) : (
                        <span className="text-xs text-green-700">{t('no')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.scheduledDate
                        ? new Date(p.scheduledDate).toLocaleDateString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t('totalCount', { total })}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                >
                  {t('prev')}
                </button>
                <span className="px-2 py-1">{page + 1} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                >
                  {t('next')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
