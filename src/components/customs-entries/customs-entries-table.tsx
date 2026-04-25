'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
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

interface CustomsEntriesTableProps {
  entries: CustomsEntry[];
}

export function CustomsEntriesTable({ entries }: CustomsEntriesTableProps) {
  const t = useTranslations('customsEntries');
  const locale = useLocale();

  const formatCurrency = (value: string | null) => {
    if (!value) return '—';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  const translateRegime = (regime: string) => {
    const key = `regimes.${regime}`;
    const translated = t(key);
    return translated === key ? regime : translated;
  };

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-36">{t('table.entryNumber')}</TableHead>
            <TableHead>{t('table.reference')}</TableHead>
            <TableHead>{t('table.key')}</TableHead>
            <TableHead>{t('table.regime')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead>{t('table.customsValue')}</TableHead>
            <TableHead>{t('table.totalContributions')}</TableHead>
            <TableHead>{t('table.date')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-sm font-medium">
                {entry.entryNumber ?? (
                  <span className="text-muted-foreground italic">
                    {t('table.pending')}
                  </span>
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
                {translateRegime(entry.regime)}
              </TableCell>
              <TableCell>
                <EntryStatusBadge status={entry.status} />
              </TableCell>
              <TableCell className="text-sm font-mono">
                {formatCurrency(entry.totalCustomsValueMxn)}
              </TableCell>
              <TableCell className="text-sm font-mono font-medium">
                {formatCurrency(entry.grandTotal)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {entry.entryDate
                  ? new Date(entry.entryDate).toLocaleDateString(locale)
                  : entry.createdAt
                    ? new Date(entry.createdAt).toLocaleDateString(locale)
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
