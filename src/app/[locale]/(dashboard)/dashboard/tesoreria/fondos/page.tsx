'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Bank, Warning } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { useDebounce } from '@/hooks/use-debounce';

interface ClientFundsRow {
  clientId: string;
  clientName: string;
  clientRfc: string | null;
  availableBalance: string;
  reservedBalance: string;
  totalDeposited: string;
  lastMovementAt: string | null;
  lowFundsAlert: boolean;
}

const formatMXN = (v: string | number | null | undefined) =>
  v != null
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
        typeof v === 'string' ? parseFloat(v) : v,
      )
    : '—';

export default function FondosPage() {
  const t = useTranslations('treasury');
  const locale = useLocale();
  const { activeOrgId } = useOrgStore();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['client-funds', activeOrgId, debouncedSearch],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/client-accounts/funds', {
        params: { q: debouncedSearch || undefined },
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data as { funds: ClientFundsRow[]; total: number };
    },
    enabled: !!activeOrgId,
  });

  const funds = data?.funds ?? [];
  const total = data?.total ?? 0;

  const totalAvailable = funds.reduce((sum, f) => sum + parseFloat(f.availableBalance ?? '0'), 0);
  const totalReserved = funds.reduce((sum, f) => sum + parseFloat(f.reservedBalance ?? '0'), 0);
  const alertCount = funds.filter((f) => f.lowFundsAlert).length;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('fundsPageTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('fundsPageDesc')}</p>
      </div>

      {alertCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          <Warning size={16} className="shrink-0" />
          <span>
            {alertCount === 1
              ? t('lowFundsWarning', { count: alertCount })
              : t('lowFundsWarningPlural', { count: alertCount })}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('totalClientsWithFunds')}</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('totalAvailableFunds')}</p>
          <p className="text-2xl font-semibold font-mono mt-1 text-green-700">
            {formatMXN(totalAvailable)}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('totalReservedFunds')}</p>
          <p className="text-2xl font-semibold font-mono mt-1 text-blue-700">
            {formatMXN(totalReserved)}
          </p>
        </div>
      </div>

      <Input
        placeholder={t('searchClients')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && funds.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Bank size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('emptyFunds')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('emptyFundsHint')}</p>
        </div>
      )}

      {!isLoading && funds.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('colClient')}</TableHead>
                <TableHead>{t('colRfc')}</TableHead>
                <TableHead className="text-right">{t('colAvailable')}</TableHead>
                <TableHead className="text-right">{t('colReserved')}</TableHead>
                <TableHead>{t('colLastMovement')}</TableHead>
                <TableHead>{t('colFundStatus')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.map((f) => (
                <TableRow key={f.clientId}>
                  <TableCell className="font-medium text-sm">{f.clientName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {f.clientRfc ?? '—'}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm font-semibold ${parseFloat(f.availableBalance) > 0 ? 'text-green-700' : 'text-muted-foreground'}`}>
                    {formatMXN(f.availableBalance)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-blue-700">
                    {parseFloat(f.reservedBalance) > 0 ? formatMXN(f.reservedBalance) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {f.lastMovementAt
                      ? new Date(f.lastMovementAt).toLocaleDateString(locale)
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {f.lowFundsAlert ? (
                      <Badge variant="outline" className="text-yellow-700 border-yellow-400 bg-yellow-50">
                        <Warning size={12} className="mr-1" />
                        {t('lowFunds')}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">OK</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
