'use client';

import { useState } from 'react';
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

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservado',
  DAMAGED: 'Dañado',
  EXPIRED: 'Vencido',
  QUARANTINE: 'Cuarentena',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  AVAILABLE: 'secondary',
  RESERVED: 'default',
  DAMAGED: 'destructive',
  EXPIRED: 'destructive',
  QUARANTINE: 'outline',
};

export default function InventarioPage() {
  const { activeOrgId } = useOrgStore();
  const [search, setSearch] = useState('');
  const [warehouseId, setWarehouseId] = useState('ALL');
  const debouncedSearch = useDebounce(search, 300);

  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/warehouse/warehouses', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data as { id: string; name: string }[];
    },
    enabled: !!activeOrgId,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['warehouse-inventory', activeOrgId, debouncedSearch, warehouseId],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/warehouse/inventory', {
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
          <h1 className="text-2xl font-semibold tracking-tight">
            Inventario de Bodega
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control de mercancías en almacén fiscal y general
          </p>
        </div>
        <Button size="sm">
          <Plus size={14} />
          Entrada de inventario
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por SKU, descripción, fracción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs min-w-0"
        />
        <Select value={warehouseId} onValueChange={setWarehouseId}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las bodegas</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Total artículos</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Disponibles</p>
          <p className="text-2xl font-semibold mt-1 text-green-700">
            {inventory.filter((i) => i.status === 'AVAILABLE').length}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Reservados</p>
          <p className="text-2xl font-semibold mt-1 text-blue-700">
            {inventory.filter((i) => i.status === 'RESERVED').length}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Con problemas</p>
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
          <p className="text-sm font-medium">Sin inventario registrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Registra la primera entrada de mercancía para comenzar
          </p>
        </div>
      )}

      {!isLoading && inventory.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU / Código</TableHead>
                <TableHead className="max-w-64">Descripción</TableHead>
                <TableHead>Fracción</TableHead>
                <TableHead>Bodega</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Valor unitario</TableHead>
                <TableHead>Valor total</TableHead>
                <TableHead>Estado</TableHead>
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
                    {parseFloat(item.currentQuantity).toLocaleString('es-MX')}{' '}
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
                      {STATUS_LABELS[item.status] ?? item.status}
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
