'use client';

import { Link } from '@/i18n/navigation'
import { ArrowRight } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { parseApiDate } from '@/lib/date-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OperationStatusBadge } from '@/components/operations/operation-status-badge';
import { OperationPriorityBadge } from '@/components/operations/operation-priority-badge';
import type { Operation } from '@/features/portal/types/portal.types';

interface PortalOperationsTableProps {
  operations: Operation[];
}

export function PortalOperationsTable({ operations }: PortalOperationsTableProps) {
  const t = useTranslations('portal.table');

  if (operations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">{t('empty')}</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('columns.reference')}</TableHead>
          <TableHead>{t('columns.title')}</TableHead>
          <TableHead>{t('columns.type')}</TableHead>
          <TableHead>{t('columns.status')}</TableHead>
          <TableHead>{t('columns.priority')}</TableHead>
          <TableHead>{t('columns.dueDate')}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {operations.map((op) => (
          <TableRow key={op.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {op.reference}
            </TableCell>
            <TableCell className="font-medium">{op.title}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{op.type}</TableCell>
            <TableCell>
              <OperationStatusBadge status={op.status} />
            </TableCell>
            <TableCell>
              <OperationPriorityBadge priority={op.priority} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {op.dueAt ? parseApiDate(op.dueAt).toLocaleDateString() : '—'}
            </TableCell>
            <TableCell>
              <Link
                href={`/portal/operations/${op.id}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('view')} <ArrowRight size={12} />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
