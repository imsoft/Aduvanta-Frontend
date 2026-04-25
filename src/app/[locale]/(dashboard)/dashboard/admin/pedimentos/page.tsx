'use client';

import { useState } from 'react';
import { useAllEntries } from '@/features/system-admin/hooks/use-system-admin';
import { MagnifyingGlass, CaretLeft, CaretRight, ClipboardText } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PAGE_SIZE = 25;

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PREVALIDATED: 'bg-yellow-100 text-yellow-700',
  VALIDATED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-purple-100 text-purple-700',
  DISPATCHED: 'bg-orange-100 text-orange-700',
  RELEASED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RECTIFIED: 'bg-gray-100 text-gray-500',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador', PREVALIDATED: 'Prevalidado', VALIDATED: 'Validado',
  PAID: 'Pagado', DISPATCHED: 'Modulado', RELEASED: 'Liberado',
  CANCELLED: 'Cancelado', RECTIFIED: 'Rectificado',
};

export default function AdminPedimentosPage() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading } = useAllEntries(PAGE_SIZE, offset, debouncedSearch || undefined);
  const total = data?.total ?? 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setOffset(0);
    setTimeout(() => setDebouncedSearch(val), 300);
  };

  const fmtMXN = (v: string | null) =>
    v ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseFloat(v)) : '—';

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Pedimentos</h1>
          <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Todos los pedimentos de la plataforma</p>
      </div>

      <div className="relative">
        <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por número, referencia o clave…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
          <p className="text-sm font-medium">{total.toLocaleString('es-MX')} pedimentos</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Página {page} de {totalPages || 1}</span>
            <Button variant="outline" size="icon" className="h-6 w-6" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
              <CaretLeft size={12} />
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6" disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
              <CaretRight size={12} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 px-5 flex items-center gap-3">
                <div className="h-4 w-40 rounded bg-muted/40 animate-pulse" />
                <div className="h-4 w-20 rounded bg-muted/30 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.entries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ClipboardText size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-medium">{entry.entryNumber ?? 'Sin número'}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${STATUS_COLORS[entry.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[entry.status] ?? entry.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cve. {entry.entryKey} · {entry.regime}
                    {entry.internalReference && ` · Ref: ${entry.internalReference}`}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="font-mono">{fmtMXN(entry.grandTotal)}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">{entry.organizationSlug}</Badge>
                  <span>{entry.createdAt ? format(new Date(entry.createdAt), 'dd MMM yyyy', { locale: es }) : '—'}</span>
                </div>
              </div>
            ))}
            {data?.entries.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">No hay pedimentos</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
