'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Plus, FileText } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomsEntriesTable } from '@/components/customs-entries/customs-entries-table';
import { useOrgStore } from '@/store/org.store';
import { useCustomsEntries } from '@/features/customs-entries/hooks/use-customs-entries';

const ENTRY_STATUSES = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PREVALIDATED', label: 'Prevalidado' },
  { value: 'VALIDATED', label: 'Validado' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'DISPATCHED', label: 'Modulado' },
  { value: 'RELEASED', label: 'Liberado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'RECTIFIED', label: 'Rectificado' },
];

const REGIMES = [
  { value: 'ALL', label: 'Todos los regímenes' },
  { value: 'IMP_DEFINITIVA', label: 'A1 — Importación definitiva' },
  { value: 'EXP_DEFINITIVA', label: 'A2 — Exportación definitiva' },
  { value: 'IMP_TEMPORAL', label: 'Importación temporal' },
  { value: 'EXP_TEMPORAL', label: 'Exportación temporal' },
  { value: 'DEPOSITO_FISCAL', label: 'Depósito fiscal' },
  { value: 'VIRTUAL', label: 'Virtual (IMMEX)' },
];

export default function PedimentosPage() {
  const { activeOrgId } = useOrgStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [regime, setRegime] = useState('ALL');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = useCustomsEntries({
    q: search || undefined,
    status: status === 'ALL' ? undefined : status,
    regime: regime === 'ALL' ? undefined : regime,
    limit,
    offset,
  });

  const entries = data?.entries ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  if (!activeOrgId) {
    return (
      <div className="w-full text-sm text-muted-foreground">
        Selecciona una organización para ver los pedimentos.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pedimentos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de pedimentos aduanales — captura, validación y seguimiento
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/pedimentos/nuevo">
            <Plus size={14} />
            Nuevo pedimento
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por número, referencia..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          className="w-full min-w-0 max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setOffset(0);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENTRY_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={regime}
          onValueChange={(v) => {
            setRegime(v);
            setOffset(0);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REGIMES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && entries.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FileText
            size={32}
            className="mx-auto mb-3 text-muted-foreground"
          />
          <p className="text-sm font-medium">No se encontraron pedimentos</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || status !== 'ALL' || regime !== 'ALL'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea el primer pedimento para comenzar'}
          </p>
          {!search && status === 'ALL' && regime === 'ALL' && (
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/pedimentos/nuevo">Nuevo pedimento</Link>
            </Button>
          )}
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          <CustomsEntriesTable entries={entries} />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {offset + 1}–{Math.min(offset + limit, total)} de {total} pedimentos
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setOffset(offset + limit)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
