'use client';

import { useState } from 'react';
import { CurrencyDollar, ArrowUp, ArrowDown, FileText } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrgStore } from '@/store/org.store';
import { useClients } from '@/features/clients/hooks/use-clients';
import {
  useClientBalance,
  useClientMovements,
  useRecordMovement,
  useGenerateStatement,
} from '@/features/client-accounts/hooks/use-client-accounts';

const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  ADVANCE_RECEIVED: 'Anticipo recibido',
  OVERPAYMENT_CREDIT: 'Crédito por excedente',
  CORRECTION_CREDIT: 'Crédito por corrección',
  CUSTOMS_DUTIES_PAID: 'Derechos aduaneros pagados',
  STORAGE_PAID: 'Almacenaje pagado',
  TRANSPORT_PAID: 'Transporte pagado',
  AGENCY_FEE: 'Honorarios agencia',
  OTHER_EXPENSES: 'Otros gastos',
  INVOICE_CHARGED: 'Cargo por factura',
  CORRECTION_DEBIT: 'Débito por corrección',
};

const CREDIT_TYPES = ['ADVANCE_RECEIVED', 'OVERPAYMENT_CREDIT', 'CORRECTION_CREDIT'];

const formatMXN = (v: string | number | null | undefined) =>
  v != null
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
        typeof v === 'string' ? parseFloat(v) : v,
      )
    : '—';

function ClientAccountPanel({ clientId }: { clientId: string }) {
  const { data: balance } = useClientBalance(clientId);
  const { data: movementsData } = useClientMovements(clientId, { limit: 50 });
  const recordMovement = useRecordMovement();
  const generateStatement = useGenerateStatement();

  const movements = movementsData?.movements ?? [];
  const balanceNum = parseFloat(balance?.balance ?? '0');

  const [newMovementOpen, setNewMovementOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [movForm, setMovForm] = useState({
    type: 'ADVANCE_RECEIVED',
    amount: '',
    description: '',
    reference: '',
    movementDate: new Date().toISOString().split('T')[0],
  });
  const [stmtPeriod, setStmtPeriod] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const handleRecordMovement = async () => {
    await recordMovement.mutateAsync({
      clientId,
      type: movForm.type,
      amount: movForm.amount,
      description: movForm.description,
      reference: movForm.reference || undefined,
      movementDate: movForm.movementDate,
    });
    setNewMovementOpen(false);
    setMovForm({
      type: 'ADVANCE_RECEIVED',
      amount: '',
      description: '',
      reference: '',
      movementDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleGenerateStatement = async () => {
    await generateStatement.mutateAsync({
      clientId,
      periodFrom: stmtPeriod.from,
      periodTo: stmtPeriod.to,
    });
    setStatementOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Balance card */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className={`rounded-lg border p-4 ${balanceNum >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
        >
          <p className="text-xs text-muted-foreground">Saldo actual</p>
          <p
            className={`text-2xl font-semibold font-mono mt-1 ${balanceNum >= 0 ? 'text-green-700' : 'text-red-700'}`}
          >
            {formatMXN(balance?.balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {balanceNum >= 0 ? 'A favor del cliente' : 'Cliente debe a la agencia'}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Fondos disponibles</p>
          <p className="text-2xl font-semibold font-mono mt-1">
            {formatMXN(balance?.funds?.availableBalance)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Para pago de derechos
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Movimientos</p>
          <p className="text-2xl font-semibold mt-1">{movementsData?.total ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total registrados</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Dialog open={newMovementOpen} onOpenChange={setNewMovementOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <ArrowDown size={14} className="mr-1.5" />
              Registrar movimiento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo movimiento de cuenta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Tipo de movimiento</Label>
                <Select
                  value={movForm.type}
                  onValueChange={(v) => setMovForm((f) => ({ ...f, type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MOVEMENT_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Importe (MXN)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={movForm.amount}
                    onChange={(e) => setMovForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={movForm.movementDate}
                    onChange={(e) => setMovForm((f) => ({ ...f, movementDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={movForm.description}
                  onChange={(e) => setMovForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Detalle del movimiento..."
                />
              </div>
              <div className="space-y-2">
                <Label>Referencia (opcional)</Label>
                <Input
                  value={movForm.reference}
                  onChange={(e) => setMovForm((f) => ({ ...f, reference: e.target.value }))}
                  placeholder="No. de factura, pedimento, etc."
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setNewMovementOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleRecordMovement}
                disabled={!movForm.amount || !movForm.description || recordMovement.isPending}
              >
                {recordMovement.isPending ? 'Guardando...' : 'Registrar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FileText size={14} className="mr-1.5" />
              Generar estado de cuenta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generar estado de cuenta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Desde</Label>
                  <Input
                    type="date"
                    value={stmtPeriod.from}
                    onChange={(e) => setStmtPeriod((p) => ({ ...p, from: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hasta</Label>
                  <Input
                    type="date"
                    value={stmtPeriod.to}
                    onChange={(e) => setStmtPeriod((p) => ({ ...p, to: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStatementOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleGenerateStatement}
                disabled={generateStatement.isPending}
              >
                {generateStatement.isPending ? 'Generando...' : 'Generar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Movements table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Referencia</TableHead>
              <TableHead className="text-right">Cargo</TableHead>
              <TableHead className="text-right">Abono</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                  Sin movimientos registrados
                </TableCell>
              </TableRow>
            )}
            {movements.map((mov) => {
              const isCredit = parseFloat(mov.amount) > 0;
              return (
                <TableRow key={mov.id}>
                  <TableCell className="text-sm">
                    {new Date(mov.movementDate).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={CREDIT_TYPES.includes(mov.type) ? 'secondary' : 'outline'} className="text-xs">
                      {MOVEMENT_TYPE_LABELS[mov.type] ?? mov.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-48 truncate">
                    {mov.description}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {mov.reference ?? '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-red-700">
                    {!isCredit ? formatMXN(Math.abs(parseFloat(mov.amount)).toFixed(2)) : ''}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-green-700">
                    {isCredit ? formatMXN(mov.amount) : ''}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium">
                    {mov.balanceAfter ? formatMXN(mov.balanceAfter) : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function CuentasCorrientesPage() {
  const { activeOrgId } = useOrgStore();
  const { data: clients = [] } = useClients();
  const [selectedClientId, setSelectedClientId] = useState('');

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Cuentas Corrientes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Anticipo de fondos, cargos, abonos y estado de cuenta por cliente
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CurrencyDollar size={18} className="text-muted-foreground" />
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Selecciona un cliente..." />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} — {c.taxId ?? c.rfc ?? ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClientId ? (
        <ClientAccountPanel clientId={selectedClientId} />
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <CurrencyDollar size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Selecciona un cliente</p>
          <p className="text-sm text-muted-foreground mt-1">
            Elige un cliente para ver su cuenta corriente y registrar movimientos
          </p>
        </div>
      )}
    </div>
  );
}
