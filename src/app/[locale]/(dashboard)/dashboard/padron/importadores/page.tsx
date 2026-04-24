'use client';

import { useState } from 'react';
import { IdentificationCard, Warning, Plus } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useClients } from '@/features/clients/hooks/use-clients';
import {
  useImporterRegistry,
  useExpiringImporterRegistry,
  useCreateImporterRegistry,
} from '@/features/importer-registry/hooks/use-importer-registry';
import { useDebounce } from '@/hooks/use-debounce';

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  SUSPENDED: 'Suspendido',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Vencido',
  PENDING: 'En trámite',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  ACTIVE: 'secondary',
  SUSPENDED: 'outline',
  CANCELLED: 'destructive',
  EXPIRED: 'destructive',
  PENDING: 'default',
};

const REGISTRY_TYPE_LABELS: Record<string, string> = {
  GENERAL: 'General',
  SECTORIAL: 'Sectorial (PISE)',
  BOTH: 'General + Sectorial',
};

export default function ImportadoresPage() {
  const { data: clients = [] } = useClients();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const debouncedSearch = useDebounce(search, 300);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    clientId: '',
    rfc: '',
    businessName: '',
    registryType: 'GENERAL',
    satFolio: '',
    inscriptionDate: '',
    expirationDate: '',
    notes: '',
  });

  const { data, isLoading } = useImporterRegistry({
    status: status === 'ALL' ? undefined : status,
    limit: 100,
  });

  const { data: expiring } = useExpiringImporterRegistry(30);
  const createRegistry = useCreateImporterRegistry();

  const records = (data?.records ?? []).filter((r) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return r.rfc.toLowerCase().includes(q) || r.businessName.toLowerCase().includes(q);
  });

  const expiringCount = expiring?.total ?? 0;

  const handleCreate = async () => {
    await createRegistry.mutateAsync({
      clientId: form.clientId,
      rfc: form.rfc,
      businessName: form.businessName,
      registryType: form.registryType,
      satFolio: form.satFolio || undefined,
      inscriptionDate: form.inscriptionDate || undefined,
      expirationDate: form.expirationDate || undefined,
      notes: form.notes || undefined,
    });
    setCreateOpen(false);
    setForm({ clientId: '', rfc: '', businessName: '', registryType: 'GENERAL', satFolio: '', inscriptionDate: '', expirationDate: '', notes: '' });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Padrón de Importadores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Padrón general y sectorial (PISE) de importadores
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={14} />
              Nuevo registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo registro de padrón</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(clients as any[]).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>RFC</Label>
                  <Input
                    value={form.rfc}
                    onChange={(e) => setForm((f) => ({ ...f, rfc: e.target.value.toUpperCase() }))}
                    placeholder="RFC del importador"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de padrón</Label>
                  <Select value={form.registryType} onValueChange={(v) => setForm((f) => ({ ...f, registryType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(REGISTRY_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Razón social</Label>
                <Input
                  value={form.businessName}
                  onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                  placeholder="Nombre o razón social"
                />
              </div>
              <div className="space-y-2">
                <Label>Folio SAT</Label>
                <Input
                  value={form.satFolio}
                  onChange={(e) => setForm((f) => ({ ...f, satFolio: e.target.value }))}
                  placeholder="Folio de inscripción al padrón"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Fecha de inscripción</Label>
                  <Input type="date" value={form.inscriptionDate} onChange={(e) => setForm((f) => ({ ...f, inscriptionDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de vencimiento</Label>
                  <Input type="date" value={form.expirationDate} onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleCreate}
                disabled={!form.clientId || !form.rfc || !form.businessName || createRegistry.isPending}
              >
                {createRegistry.isPending ? 'Guardando...' : 'Crear registro'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {expiringCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          <Warning size={16} className="shrink-0" />
          <span>
            {expiringCount} registro{expiringCount > 1 ? 's' : ''} con vencimiento en los próximos 30 días
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por RFC o razón social..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs min-w-0"
        />
        <Select value={status} onValueChange={setStatus}>
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
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && records.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <IdentificationCard size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Sin registros de padrón</p>
          <p className="text-sm text-muted-foreground mt-1">
            Agrega el primer registro de padrón de importadores
          </p>
        </div>
      )}

      {!isLoading && records.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFC</TableHead>
                <TableHead>Razón social</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Folio SAT</TableHead>
                <TableHead>Inscripción</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => {
                const isExpiringSoon = r.expirationDate &&
                  new Date(r.expirationDate) <= new Date(Date.now() + 30 * 86400000);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm font-medium">{r.rfc}</TableCell>
                    <TableCell className="text-sm max-w-48 truncate">{r.businessName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {REGISTRY_TYPE_LABELS[r.registryType] ?? r.registryType}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {r.satFolio ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.inscriptionDate ? new Date(r.inscriptionDate).toLocaleDateString('es-MX') : '—'}
                    </TableCell>
                    <TableCell className={`text-sm ${isExpiringSoon ? 'text-yellow-700 font-medium' : ''}`}>
                      {r.expirationDate ? (
                        <span className="flex items-center gap-1">
                          {isExpiringSoon && <Warning size={12} />}
                          {new Date(r.expirationDate).toLocaleDateString('es-MX')}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[r.status] ?? 'outline'}>
                        {STATUS_LABELS[r.status] ?? r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
