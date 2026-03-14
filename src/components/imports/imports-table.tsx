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

interface ImportsTableProps {
  jobs: ImportJob[];
}

export function ImportsTable({ jobs }: ImportsTableProps) {
  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">No import jobs yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead>Completed</TableHead>
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
                  ? `${summary.created} created, ${summary.failed} failed`
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
