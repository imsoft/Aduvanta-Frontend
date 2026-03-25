'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImportJobStatusBadge } from './import-job-status-badge';
import type { ImportJob, ImportResultSummary } from '@/features/imports/types/import-job.types';
import { useTranslations } from 'next-intl'

interface ImportsTableProps {
  jobs: ImportJob[];
}

export function ImportsTable({ jobs }: ImportsTableProps) {
  const t = useTranslations()

  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('imports.table.empty')}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('imports.table.columns.type')}</TableHead>
          <TableHead>{t('imports.table.columns.status')}</TableHead>
          <TableHead>{t('imports.table.columns.file')}</TableHead>
          <TableHead>{t('imports.table.columns.result')}</TableHead>
          <TableHead>{t('imports.table.columns.requested')}</TableHead>
          <TableHead>{t('imports.table.columns.completed')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => {
          const summary: ImportResultSummary | null = job.resultSummaryJson
            ? (JSON.parse(job.resultSummaryJson) as ImportResultSummary)
            : null;

          return (
            <TableRow key={job.id}>
              <TableCell className="font-mono text-xs">{job.type}</TableCell>
              <TableCell>
                <ImportJobStatusBadge status={job.status} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {job.fileName ?? '—'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {summary
                  ? t('imports.table.resultSummary', {
                      created: summary.created,
                      failed: summary.failed,
                    })
                  : '—'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(job.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {job.completedAt ? new Date(job.completedAt).toLocaleString() : '—'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
