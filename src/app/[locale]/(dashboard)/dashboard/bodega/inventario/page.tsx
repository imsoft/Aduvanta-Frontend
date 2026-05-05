'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Warehouse } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOrgStore } from '@/store/org.store';
import { apiClient } from '@/lib/api-client';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

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

const EMPTY_FORM = {
  warehouseId: '',
  productDescription: '',
  quantity: '',
  unitOfMeasure: '',
  sku: '',
  tariffFraction: '',
};

export default function InventarioPage() {
  const t = useTranslations('warehouse');
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [warehouseId, setWarehouseId] = useState('ALL');
  const debouncedSearch = useDebounce(search, 300);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isPending, setIsPending] = useState(false);

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrgId) return;
    if (!form.warehouseId || !form.productDescription || !form.quantity || !form.unitOfMeasure) {
      toast.error(t('addInventoryValidation'));
      return;
    }
    setIsPending(true);
    try {
      await apiClient.post(
        '/api/warehouse/inventory',
        {
          warehouseId: form.warehouseId,
          productDescription: form.productDescription,
          quantity: parseFloat(form.quantity),
          unitOfMeasure: form.unitOfMeasure,
          sku: form.sku || undefined,
          tariffFraction: form.tariffFraction || undefined,
        },
        { headers: { 'x-organization-id': activeOrgId } },
      );
      toast.success(t('addInventorySuccess'));
      setForm(EMPTY_FORM);
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ['warehouse-inventory', activeOrgId] });
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? t('addInventoryError'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('inventoryPageTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('inventoryPageDesc')}</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('addInventoryTitle')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('colWarehouse')} *</Label>
              <Select
                value={form.warehouseId}
                onValueChange={(v) => setForm((f) => ({ ...f, warehouseId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectWarehouse')} />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('colDescription')} *</Label>
              <Input
                value={form.productDescription}
                onChange={(e) => setForm((f) => ({ ...f, productDescription: e.target.value }))}
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t('colQuantity')} *</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('unitOfMeasure')} *</Label>
                <Input
                  value={form.unitOfMeasure}
                  onChange={(e) => setForm((f) => ({ ...f, unitOfMeasure: e.target.value }))}
                  placeholder="KG, PZA, LT…"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t('colSku')}</Label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  placeholder="SKU-001"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('colFraction')}</Label>
                <Input
                  value={form.tariffFraction}
                  onChange={(e) => setForm((f) => ({ ...f, tariffFraction: e.target.value }))}
                  placeholder="8471.30.01"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('saving') : t('addInventory')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
