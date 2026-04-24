'use client';

import { useState } from 'react';
import { Factory, Warning, Plus } from '@phosphor-icons/react';
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
  useImmexPrograms,
  useExpiringImmexPrograms,
  useCreateImmexProgram,
} from '@/features/immex-programs/hooks/use-immex-programs';
import { useDebounce } from '@/hooks/use-debounce';

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  MANUFACTURERA: 'Manufacturera',
  MAQUILADORA: 'Maquiladora',
  SERVICIOS: 'Servicios',
  ALBERGUE: 'Albergue',
  CONTROLADORA: 'Controladora de empresas',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Vigente',
  SUSPENDED: 'Suspendido',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Vencido',
  IN_PROCESS: 'En trámite',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  ACTIVE: 'secondary',
  SUSPENDED: 'outline',
  CANCELLED: 'destructive',
  EXPIRED: 'destructive',
  IN_PROCESS: 'default',
};

const formatUSD = (v: string | null) =>
  v
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(v))
    : '—';

export default function ImmexPage() {
  const { data: clients = [] } = useClients();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [programType, setProgramType] = useState('ALL');
  const debouncedSearch = useDebounce(search, 300);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    clientId: '',
    programNumber: '',
    programType: 'MANUFACTURERA',
    companyName: '',
    rfc: '',
    approvalDate: '',
    expirationDate: '',
    annualExportCommitmentUsd: '',
    notes: '',
  });

  const { data, isLoading } = useImmexPrograms({
    status: status === 'ALL' ? undefined : status,
    programType: programType === 'ALL' ? undefined : programType,
    limit: 100,
  });

  const { data: expiring } = useExpiringImmexPrograms(60);
  const createProgram = useCreateImmexProgram();

  const programs = (data?.programs ?? []).filter((p) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      p.programNumber.toLowerCase().includes(q) ||
      p.rfc.toLowerCase().includes(q) ||
      p.companyName.toLowerCase().includes(q)
    );
  });

  const expiringCount = expiring?.total ?? 0;

  const handleCreate = async () => {
    await createProgram.mutateAsync({
      clientId: form.clientId,
      programNumber: form.programNumber,
      programType: form.programType,
      companyName: form.companyName,
      rfc: form.rfc,
      approvalDate: form.approvalDate || undefined,
      expirationDate: form.expirationDate || undefined,
      annualExportCommitmentUsd: form.annualExportCommitmentUsd || undefined,
      notes: form.notes || undefined,
    });
    setCreateOpen(false);
    setForm({ clientId: '', programNumber: '', programType: 'MANUFACTURERA', companyName: '', rfc: '', approvalDate: '', expirationDate: '', annualExportCommitmentUsd: '', notes: '' });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Programas IMMEX
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Programas de Industria Manufacturera, Maquiladora y de Servicios de Exportación
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={14} />
              Nuevo programa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo programa IMMEX</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecciona un cliente..." /></SelectTrigger>
                  <SelectContent>
                    {(clients as any[]).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Número de programa</Label>
                  <Input
                    value={form.programNumber}
                    onChange={(e) => setForm((f) => ({ ...f, programNumber: e.target.value }))}
                    placeholder="Ej. 111-123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de programa</Label>
                  <Select value={form.programType} onValueChange={(v) => setForm((f) => ({ ...f, programType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROGRAM_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Razón social</Label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div className="space-y-2">
                <Label>RFC</Label>
                <Input
                  value={form.rfc}
                  onChange={(e) => setForm((f) => ({ ...f, rfc: e.target.value.toUpperCase() }))}
                  placeholder="RFC de la empresa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Fecha de autorización</Label>
                  <Input type="date" value={form.approvalDate} onChange={(e) => setForm((f) => ({ ...f, approvalDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de vencimiento</Label>
                  <Input type="date" value={form.expirationDate} onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Compromiso anual de exportación (USD)</Label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.annualExportCommitmentUsd}
                  onChange={(e) => setForm((f) => ({ ...f, annualExportCommitmentUsd: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleCreate}
                disabled={!form.clientId || !form.programNumber || !form.companyName || !form.rfc || createProgram.isPending}
              >
                {createProgram.isPending ? 'Guardando...' : 'Crear programa'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {expiringCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          <Warning size={16} className="shrink-0" />
          <span>
            {expiringCount} programa{expiringCount > 1 ? 's' : ''} con vencimiento en los próximos 60 días
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por no. programa, RFC, razón social..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs min-w-0"
        />
        <Select value={programType} onValueChange={setProgramType}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los tipos</SelectItem>
            {Object.entries(PROGRAM_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
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

      {!isLoading && programs.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Factory size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Sin programas IMMEX registrados</p>
          <p className="text-sm text-muted-foreground mt-1">
            Agrega el primer programa IMMEX de tus clientes
          </p>
        </div>
      )}

      {!isLoading && programs.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Programa</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>RFC</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Comp. exportación</TableHead>
                <TableHead>Autorización</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((p) => {
                const isExpiringSoon = p.expirationDate &&
                  new Date(p.expirationDate) <= new Date(Date.now() + 60 * 86400000);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm font-medium">{p.programNumber}</TableCell>
                    <TableCell className="text-sm max-w-40 truncate">{p.companyName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.rfc}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {PROGRAM_TYPE_LABELS[p.programType] ?? p.programType}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatUSD(p.annualExportCommitmentUsd)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.approvalDate ? new Date(p.approvalDate).toLocaleDateString('es-MX') : '—'}
                    </TableCell>
                    <TableCell className={`text-sm ${isExpiringSoon ? 'text-yellow-700 font-medium' : ''}`}>
                      {p.expirationDate ? (
                        <span className="flex items-center gap-1">
                          {isExpiringSoon && <Warning size={12} />}
                          {new Date(p.expirationDate).toLocaleDateString('es-MX')}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status] ?? 'outline'}>
                        {STATUS_LABELS[p.status] ?? p.status}
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
