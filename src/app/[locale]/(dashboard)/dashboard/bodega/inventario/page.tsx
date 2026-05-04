'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Warehouse } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { apiClient } from '@/lib/api-client';
import { useDebounce } from '@/hooks/use-debounce';

interface InventoryItem {
  id: string;
  warehouseId: string;
  warehouseName?: string;
  zoneId: string | null;
  zoneName?: string;
  sku: string | null;
  description: string;
  tariffFraction: string | null;
  currentQuantity: string;
  unitOfMeasure: string | null;
  unitValueMxn: string | null;
  totalValueMxn: string | null;
  status: string;
  lastMovementAt: string | null;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  AVAILABLE: 'secondary',
  RESERVED: 'default',
  DAMAGED: 'destructive',
  EXPIRED: 'destructive',
  QUARANTINE: 'outline',
};

const STATUS_LABEL_KEY: Record<string, 'statusAvailable' | 'statusReserved' | 'statusDamaged' | 'statusExpired' | 'statusQuarantine'> = {
  AVAILABLE: 'statusAvailable',
  RESERVED: 'statusReserved',
  DAMAGED: 'statusDamaged',
  EXPIRED: 'statusExpired',
  QUARANTINE: 'statusQuarantine',
};

export default function InventarioPage() {
  const t = useTranslations('warehouse');
  const { activeOrgId } = useOrgStore();
  const [search, setSearch] = useState('');
  const [warehouseId, setWarehouseId] = useState('ALL');
  const debouncedSearch = useDebounce(search, 300);

  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/warehouse', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data as { id: string; name: string }[];
    },
    enabled: !!activeOrgId,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['warehouse-inventory', activeOrgId, debouncedSearch, warehouseId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/warehouse/inventory/list', {
        params: {
          q: debouncedSearch || undefined,
          warehouseId: warehouseId === 'ALL' ? undefined : warehouseId,
          limit: 50,
        },
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data as { inventory: InventoryItem[]; total: number };
    },
    enabled: !!activeOrgId,
  });

  const inventory = data?.inventory ?? [];
  const total = data?.total ?? 0;

  const formatMXN = (v: string | null) =>
    v
      ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
          parseFloat(v),
        )
      : '—';

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('inventoryPageTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('inventoryPageDesc')}</p>
        </div>
        <Button size="sm">
          <Plus size={14} />
          {t('addInventory')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t('searchInventory')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs min-w-0"
        />
        <Select value={warehouseId} onValueChange={setWarehouseId}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allWarehouses')}</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('totalItems')}</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('available')}</p>
          <p className="text-2xl font-semibold mt-1 text-green-700">
            {inventory.filter((i) => i.status === 'AVAILABLE').length}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('reserved')}</p>
          <p className="text-2xl font-semibold mt-1 text-blue-700">
            {inventory.filter((i) => i.status === 'RESERVED').length}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('withIssues')}</p>
          <p className="text-2xl font-semibold mt-1 text-red-700">
            {inventory.filter((i) => ['DAMAGED', 'EXPIRED', 'QUARANTINE'].includes(i.status)).length}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && inventory.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Warehouse size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('emptyInventory')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('emptyInventoryHint')}</p>
        </div>
      )}

      {!isLoading && inventory.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('colSku')}</TableHead>
                <TableHead className="max-w-64">{t('colDescription')}</TableHead>
                <TableHead>{t('colFraction')}</TableHead>
                <TableHead>{t('colWarehouse')}</TableHead>
                <TableHead>{t('colQuantity')}</TableHead>
                <TableHead>{t('colUnitValue')}</TableHead>
                <TableHead>{t('colTotalValue')}</TableHead>
                <TableHead>{t('colStatus')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {item.sku ?? '—'}
                  </TableCell>
                  <TableCell className="max-w-64 truncate text-sm">
                    {item.description}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.tariffFraction ?? '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.warehouseName ?? item.warehouseId.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {parseFloat(item.currentQuantity).toLocaleString()}{' '}
                    <span className="text-muted-foreground text-xs">
                      {item.unitOfMeasure ?? ''}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatMXN(item.unitValueMxn)}
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">
                    {formatMXN(item.totalValueMxn)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[item.status] ?? 'outline'}>
                      {STATUS_LABEL_KEY[item.status] ? t(STATUS_LABEL_KEY[item.status]) : item.status}
                    </Badge>
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
