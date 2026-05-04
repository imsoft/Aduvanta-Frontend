'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CurrencyDollar, ArrowDown, FileText } from '@phosphor-icons/react';
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

const CREDIT_TYPES = ['ADVANCE_RECEIVED', 'OVERPAYMENT_CREDIT', 'CORRECTION_CREDIT'];

const MOVEMENT_TYPE_KEYS = [
  'ADVANCE_RECEIVED',
  'OVERPAYMENT_CREDIT',
  'CORRECTION_CREDIT',
  'CUSTOMS_DUTIES_PAID',
  'STORAGE_PAID',
  'TRANSPORT_PAID',
  'AGENCY_FEE',
  'OTHER_EXPENSES',
  'INVOICE_CHARGED',
  'CORRECTION_DEBIT',
] as const;

const formatMXN = (v: string | number | null | undefined) =>
  v != null
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
        typeof v === 'string' ? parseFloat(v) : v,
      )
    : '—';

function ClientAccountPanel({ clientId }: { clientId: string }) {
  const t = useTranslations('treasury');
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
      <div className="grid grid-cols-3 gap-4">
        <div
          className={`rounded-lg border p-4 ${balanceNum >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
        >
          <p className="text-xs text-muted-foreground">{t('currentBalance')}</p>
          <p
            className={`text-2xl font-semibold font-mono mt-1 ${balanceNum >= 0 ? 'text-green-700' : 'text-red-700'}`}
          >
            {formatMXN(balance?.balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {balanceNum >= 0 ? t('clientCredit') : t('clientOwes')}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('availableFunds')}</p>
          <p className="text-2xl font-semibold font-mono mt-1">
            {formatMXN(balance?.funds?.availableBalance)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('forDuties')}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{t('movements')}</p>
          <p className="text-2xl font-semibold mt-1">{movementsData?.total ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('totalMovements')}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Dialog open={newMovementOpen} onOpenChange={setNewMovementOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <ArrowDown size={14} className="mr-1.5" />
              {t('recordMovement')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('newMovement')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t('movementType')}</Label>
                <Select
                  value={movForm.type}
                  onValueChange={(v) => setMovForm((f) => ({ ...f, type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOVEMENT_TYPE_KEYS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {t(`movementTypes.${k}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('amount')}</Label>
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
                  <Label>{t('date')}</Label>
                  <Input
                    type="date"
                    value={movForm.movementDate}
                    onChange={(e) => setMovForm((f) => ({ ...f, movementDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('description')}</Label>
                <Input
                  value={movForm.description}
                  onChange={(e) => setMovForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder={t('descriptionHint')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('reference')}</Label>
                <Input
                  value={movForm.reference}
                  onChange={(e) => setMovForm((f) => ({ ...f, reference: e.target.value }))}
                  placeholder={t('referenceHint')}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setNewMovementOpen(false)}>
                {t('cancel')}
              </Button>
              <Button
                onClick={handleRecordMovement}
                disabled={!movForm.amount || !movForm.description || recordMovement.isPending}
              >
                {recordMovement.isPending ? t('saving') : t('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FileText size={14} className="mr-1.5" />
              {t('generateStatement')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('generateStatement')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('from')}</Label>
                  <Input
                    type="date"
                    value={stmtPeriod.from}
                    onChange={(e) => setStmtPeriod((p) => ({ ...p, from: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('to')}</Label>
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
                {t('cancel')}
              </Button>
              <Button
                onClick={handleGenerateStatement}
                disabled={generateStatement.isPending}
              >
                {generateStatement.isPending ? t('generating') : t('generate')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('colDate')}</TableHead>
              <TableHead>{t('colType')}</TableHead>
              <TableHead>{t('colDescription')}</TableHead>
              <TableHead>{t('colReference')}</TableHead>
              <TableHead className="text-right">{t('colDebit')}</TableHead>
              <TableHead className="text-right">{t('colCredit')}</TableHead>
              <TableHead className="text-right">{t('colBalance')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                  {t('noMovements')}
                </TableCell>
              </TableRow>
            )}
            {movements.map((mov) => {
              const isCredit = parseFloat(mov.amount) > 0;
              return (
                <TableRow key={mov.id}>
                  <TableCell className="text-sm">
                    {new Date(mov.movementDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={CREDIT_TYPES.includes(mov.type) ? 'secondary' : 'outline'} className="text-xs">
                      {t(`movementTypes.${mov.type}` as any, { default: mov.type })}
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
  const t = useTranslations('treasury');
  const { activeOrgId } = useOrgStore();
  const { data: clients = [] } = useClients();
  const [selectedClientId, setSelectedClientId] = useState('');

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('accountsPageTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('accountsPageDesc')}</p>
      </div>

      <div className="flex items-center gap-3">
        <CurrencyDollar size={18} className="text-muted-foreground" />
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder={t('selectClient')} />
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
          <p className="text-sm font-medium">{t('selectClient')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('selectClientHint')}</p>
        </div>
      )}
    </div>
  );
}
