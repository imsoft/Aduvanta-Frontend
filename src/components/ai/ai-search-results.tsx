'use client';

import { Link } from '@/i18n/navigation'
import { ArrowRight } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AiSearchResult } from '@/features/ai-search/types/ai-search.types';

interface AiSearchResultsProps {
  result: AiSearchResult;
}

export function AiSearchResults({ result }: AiSearchResultsProps) {
  const t = useTranslations()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {t(`ai.queryTypes.${result.queryType}`)}
        </p>
        <span className="text-xs text-muted-foreground">{result.message}</span>
      </div>

      {result.data.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center">
          <p className="text-sm text-muted-foreground">{t('ai.noResults')}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('ai.table.reference')}</TableHead>
              <TableHead>{t('ai.table.title')}</TableHead>
              <TableHead>{t('ai.table.status')}</TableHead>
              <TableHead>{t('ai.table.priority')}</TableHead>
              <TableHead>{t('ai.table.reason')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.map((item) => (
              <TableRow key={item.operationId}>
                <TableCell className="font-mono text-xs">{item.reference}</TableCell>
                <TableCell className="max-w-48 truncate text-sm">{item.title}</TableCell>
                <TableCell className="text-xs">{item.status}</TableCell>
                <TableCell className="text-xs">{item.priority}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-56 truncate">
                  {item.reason}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/operations/${item.operationId}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t('ai.viewOperation')} <ArrowRight size={12} />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
