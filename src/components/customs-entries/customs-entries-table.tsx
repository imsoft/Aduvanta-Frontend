'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight } from '@phosphor-icons/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { CustomsEntry } from '@/features/customs-entries/types/customs-entry.types';
import { EntryStatusBadge } from './entry-status-badge';

const REGIME_LABELS: Record<string, string> = {
  IMP_DEFINITIVA: 'A1 — Importación definitiva',
  EXP_DEFINITIVA: 'A2 — Exportación definitiva',
  IMP_TEMPORAL: 'Importación temporal',
  EXP_TEMPORAL: 'Exportación temporal',
  DEPOSITO_FISCAL: 'Depósito fiscal',
  TRANSITO_INTERNO: 'Tránsito interno',
  TRANSITO_INTERNACIONAL: 'Tránsito internacional',
  VIRTUAL: 'Virtual (IMMEX)',
  OTHER: 'Otro',
};

const formatMXN = (value: string | null) => {
  if (!value) return '—';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(parseFloat(value));
};

interface CustomsEntriesTableProps {
  entries: CustomsEntry[];
}

export function CustomsEntriesTable({ entries }: CustomsEntriesTableProps) {
  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-36">No. Pedimento</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>Clave</TableHead>
            <TableHead>Régimen</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Valor en Aduana</TableHead>
            <TableHead>Total Contribuciones</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-sm font-medium">
                {entry.entryNumber ?? (
                  <span className="text-muted-foreground italic">Pendiente</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {entry.internalReference ?? '—'}
              </TableCell>
              <TableCell>
                <span className="font-mono font-semibold text-sm">
                  {entry.entryKey}
                </span>
              </TableCell>
              <TableCell className="text-sm max-w-40 truncate">
                {REGIME_LABELS[entry.regime] ?? entry.regime}
              </TableCell>
              <TableCell>
                <EntryStatusBadge status={entry.status} />
              </TableCell>
              <TableCell className="text-sm font-mono">
                {formatMXN(entry.totalCustomsValueMxn)}
              </TableCell>
              <TableCell className="text-sm font-mono font-medium">
                {formatMXN(entry.grandTotal)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {entry.entryDate
                  ? new Date(entry.entryDate).toLocaleDateString('es-MX')
                  : entry.createdAt
                    ? new Date(entry.createdAt).toLocaleDateString('es-MX')
                    : '—'}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <Link href={`/dashboard/pedimentos/${entry.id}`}>
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
