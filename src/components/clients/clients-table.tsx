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
import type { Client } from '@/features/clients/types/client.types';
import { ClientStatusBadge } from './client-status-badge';

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const t = useTranslations('clients');

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('legalName')}</TableHead>
            <TableHead>{t('taxId')}</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead>{t('phone')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {client.legalName ?? '—'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.taxId ?? '—'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.email ?? '—'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.phone ?? '—'}
              </TableCell>
              <TableCell>
                <ClientStatusBadge status={client.status} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <Link href={`/dashboard/clients/${client.id}`}>
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
