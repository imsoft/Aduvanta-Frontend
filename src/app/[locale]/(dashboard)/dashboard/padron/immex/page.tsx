'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  ACTIVE: 'secondary',
  SUSPENDED: 'outline',
  CANCELLED: 'destructive',
  EXPIRED: 'destructive',
  IN_PROCESS: 'default',
};

const PROGRAM_TYPE_KEYS = ['MANUFACTURERA', 'MAQUILADORA', 'SERVICIOS', 'ALBERGUE', 'CONTROLADORA'] as const;
const STATUS_KEYS = ['ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED', 'IN_PROCESS'] as const;

const formatUSD = (v: string | null) =>
  v
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(v))
    : '—';

export default function ImmexPage() {
  const t = useTranslations('immex');
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
          <h1 className="text-2xl font-semibold tracking-tight">{t('pageTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('pageDescription')}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={14} />
              {t('newProgram')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('newProgramTitle')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t('labelClient')}</Label>
                <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
                  <SelectTrigger><SelectValue placeholder={t('selectClient')} /></SelectTrigger>
                  <SelectContent>
                    {(clients as any[]).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('labelProgramNumber')}</Label>
                  <Input
                    value={form.programNumber}
                    onChange={(e) => setForm((f) => ({ ...f, programNumber: e.target.value }))}
                    placeholder={t('programNumberHint')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('labelProgramType')}</Label>
                  <Select value={form.programType} onValueChange={(v) => setForm((f) => ({ ...f, programType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROGRAM_TYPE_KEYS.map((k) => (
                        <SelectItem key={k} value={k}>{t(`programTypes.${k}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('labelCompanyName')}</Label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                  placeholder={t('companyNameHint')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('labelRfc')}</Label>
                <Input
                  value={form.rfc}
                  onChange={(e) => setForm((f) => ({ ...f, rfc: e.target.value.toUpperCase() }))}
                  placeholder={t('rfcHint')}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('labelApprovalDate')}</Label>
                  <Input type="date" value={form.approvalDate} onChange={(e) => setForm((f) => ({ ...f, approvalDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>{t('labelExpirationDate')}</Label>
                  <Input type="date" value={form.expirationDate} onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('labelExportCommitment')}</Label>
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
              <Button variant="outline" onClick={() => setCreateOpen(false)}>{t('cancel')}</Button>
              <Button
                onClick={handleCreate}
                disabled={!form.clientId || !form.programNumber || !form.companyName || !form.rfc || createProgram.isPending}
              >
                {createProgram.isPending ? t('saving') : t('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {expiringCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          <Warning size={16} className="shrink-0" />
          <span>
            {expiringCount === 1
              ? t('expiringWarning', { count: expiringCount })
              : t('expiringWarningPlural', { count: expiringCount })}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs min-w-0"
        />
        <Select value={programType} onValueChange={setProgramType}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allTypes')}</SelectItem>
            {PROGRAM_TYPE_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{t(`programTypes.${k}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allStatuses')}</SelectItem>
            {STATUS_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{t(`statuses.${k}`)}</SelectItem>
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
          <p className="text-sm font-medium">{t('empty')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('emptyHint')}</p>
        </div>
      )}

      {!isLoading && programs.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('colProgram')}</TableHead>
                <TableHead>{t('colCompany')}</TableHead>
                <TableHead>{t('colRfc')}</TableHead>
                <TableHead>{t('colType')}</TableHead>
                <TableHead className="text-right">{t('colExportCommitment')}</TableHead>
                <TableHead>{t('colApproval')}</TableHead>
                <TableHead>{t('colExpiration')}</TableHead>
                <TableHead>{t('colStatus')}</TableHead>
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
                      {t(`programTypes.${p.programType}` as any, { default: p.programType })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatUSD(p.annualExportCommitmentUsd)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.approvalDate ? new Date(p.approvalDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className={`text-sm ${isExpiringSoon ? 'text-yellow-700 font-medium' : ''}`}>
                      {p.expirationDate ? (
                        <span className="flex items-center gap-1">
                          {isExpiringSoon && <Warning size={12} />}
                          {new Date(p.expirationDate).toLocaleDateString()}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status] ?? 'outline'}>
                        {t(`statuses.${p.status}` as any, { default: p.status })}
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
