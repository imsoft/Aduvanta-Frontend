'use client';

import { Link } from '@/i18n/navigation'
import { ArrowRight } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Operation } from '@/features/operations/types/operation.types';
import { OperationStatusBadge } from './operation-status-badge';
import { OperationPriorityBadge } from './operation-priority-badge';

interface OperationsTableProps {
  operations: Operation[];
  clientNames?: Record<string, string>;
  userNames?: Record<string, string>;
}

export function OperationsTable({
  operations,
  clientNames = {},
  userNames = {},
}: OperationsTableProps) {
  const t = useTranslations('operations');

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reference')}</TableHead>
            <TableHead>{t('client')}</TableHead>
            <TableHead>{t('titleField')}</TableHead>
            <TableHead>{t('type')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('priority')}</TableHead>
            <TableHead>{t('assignedTo')}</TableHead>
            <TableHead>{t('opened')}</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.map((op) => (
            <TableRow key={op.id}>
              <TableCell className="font-mono text-sm font-medium">
                {op.reference}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {clientNames[op.clientId] ?? op.clientId.slice(0, 8) + '…'}
              </TableCell>
              <TableCell className="max-w-48 truncate">{op.title}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{op.type}</TableCell>
              <TableCell>
                <OperationStatusBadge status={op.status} />
              </TableCell>
              <TableCell>
                <OperationPriorityBadge priority={op.priority} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {op.assignedUserId
                  ? (userNames[op.assignedUserId] ?? '—')
                  : '—'}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {op.openedAt
                  ? new Date(op.openedAt).toLocaleDateString()
                  : '—'}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <Link href={`/dashboard/operations/${op.id}`}>
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
