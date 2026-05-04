'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowsLeftRight, ArrowUp, ArrowDown, ArrowRight } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
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
import { useQuery } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { apiClient } from '@/lib/api-client';
import { useDebounce } from '@/hooks/use-debounce';

interface WarehouseMovement {
  id: string;
  movementType: string;
  referenceNumber: string | null;
  sourceWarehouseId: string | null;
  sourceWarehouseName?: string;
  destinationWarehouseId: string | null;
  destinationWarehouseName?: string;
  inventoryItemId: string | null;
  itemDescription: string | null;
  quantity: string;
  unitOfMeasure: string | null;
  movementDate: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const MOVEMENT_TYPE_ICON: Record<string, typeof ArrowUp> = {
  ENTRY: ArrowDown,
  EXIT: ArrowUp,
  TRANSFER: ArrowRight,
  ADJUSTMENT: ArrowsLeftRight,
  RETURN: ArrowDown,
};

const MOVEMENT_TYPE_COLOR: Record<string, string> = {
  ENTRY: 'text-green-700',
  EXIT: 'text-red-700',
  TRANSFER: 'text-blue-700',
  ADJUSTMENT: 'text-orange-700',
  RETURN: 'text-purple-700',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  PENDING: 'outline',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

const MOVEMENT_TYPE_KEYS = ['ENTRY', 'EXIT', 'TRANSFER', 'ADJUSTMENT', 'RETURN'] as const;
const STATUS_KEYS = ['PENDING', 'COMPLETED', 'CANCELLED'] as const;

export default function MovimientosPage() {
  const t = useTranslations('warehouse');
  const { activeOrgId } = useOrgStore();
  const [search, setSearch] = useState('');
  const [movementType, setMovementType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);
  const limit = 50;

  const { data, isLoading } = useQuery({
    queryKey: ['warehouse-movements', activeOrgId, debouncedSearch, movementType, status, page],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/warehouse/movements/list', {
        params: {
          q: debouncedSearch || undefined,
          movementType: movementType === 'ALL' ? undefined : movementType,
          status: status === 'ALL' ? undefined : status,
          limit,
          offset: page * limit,
        },
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data as { movements: WarehouseMovement[]; total: number };
    },
    enabled: !!activeOrgId,
  });

  const movements = data?.movements ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('movementsPageTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('movementsPageDesc')}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t('searchMovements')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs min-w-0"
        />
        <Select value={movementType} onValueChange={(v) => { setMovementType(v); setPage(0); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allMovementTypes')}</SelectItem>
            {MOVEMENT_TYPE_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{t(`movementTypes.${k}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allStatuses')}</SelectItem>
            {STATUS_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{t(`movementStatuses.${k}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && movements.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <ArrowsLeftRight size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('emptyMovements')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('emptyMovementsHint')}</p>
        </div>
      )}

      {!isLoading && movements.length > 0 && (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('colType')}</TableHead>
                  <TableHead>{t('colReference')}</TableHead>
                  <TableHead className="max-w-48">{t('colDescription')}</TableHead>
                  <TableHead>{t('colOrigin')}</TableHead>
                  <TableHead>{t('colDestination')}</TableHead>
                  <TableHead className="text-right">{t('colAmount')}</TableHead>
                  <TableHead>{t('colDate')}</TableHead>
                  <TableHead>{t('colStatus')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((mov) => {
                  const Icon = MOVEMENT_TYPE_ICON[mov.movementType] ?? ArrowsLeftRight;
                  return (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${MOVEMENT_TYPE_COLOR[mov.movementType] ?? ''}`}>
                          <Icon size={14} />
                          {t(`movementTypes.${mov.movementType}` as any, { default: mov.movementType })}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {mov.referenceNumber ?? '—'}
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-sm">
                        {mov.itemDescription ?? '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {mov.sourceWarehouseName ?? (mov.sourceWarehouseId ? mov.sourceWarehouseId.slice(0, 8) : '—')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {mov.destinationWarehouseName ?? (mov.destinationWarehouseId ? mov.destinationWarehouseId.slice(0, 8) : '—')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {parseFloat(mov.quantity).toLocaleString()}{' '}
                        <span className="text-muted-foreground text-xs">{mov.unitOfMeasure ?? ''}</span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(mov.movementDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[mov.status] ?? 'outline'}>
                          {t(`movementStatuses.${mov.status}` as any, { default: mov.status })}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t('totalMovements', { total })}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                >
                  {t('prev')}
                </button>
                <span className="px-2 py-1">
                  {page + 1} / {totalPages}
                </span>
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
