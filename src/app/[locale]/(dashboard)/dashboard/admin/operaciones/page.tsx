'use client';

import { useState } from 'react';
import { useAllOperations } from '@/features/system-admin/hooks/use-system-admin';
import { CaretLeft, CaretRight, FileText } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PAGE_SIZE = 25;

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  ON_HOLD: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierta',
  IN_PROGRESS: 'En proceso',
  ON_HOLD: 'En espera',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

const TYPE_LABELS: Record<string, string> = {
  IMPORT: 'Importación',
  EXPORT: 'Exportación',
  INTERNAL: 'Interno',
};

export default function AdminOperacionesPage() {
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useAllOperations(PAGE_SIZE, offset);
  const total = data?.total ?? 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Operaciones</h1>
          <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Todas las operaciones de la plataforma</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
          <p className="text-sm font-medium">{total.toLocaleString('es-MX')} operaciones</p>
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
                <div className="h-4 w-48 rounded bg-muted/40 animate-pulse" />
                <div className="h-4 w-20 rounded bg-muted/30 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.operations.map((op) => (
              <div key={op.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-mono font-medium">{op.reference}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${STATUS_COLORS[op.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[op.status] ?? op.status}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[op.priority] ?? 'bg-gray-100 text-gray-600'}`}>
                      {PRIORITY_LABELS[op.priority] ?? op.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {op.title} · {TYPE_LABELS[op.type] ?? op.type}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <Badge variant="outline" className="text-[10px] font-mono">{op.organizationSlug ?? op.organizationId.slice(0, 8)}</Badge>
                  <span>{op.createdAt ? format(new Date(op.createdAt), 'dd MMM yyyy', { locale: es }) : '—'}</span>
                </div>
              </div>
            ))}
            {data?.operations.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">No hay operaciones</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
