'use client';

import { DownloadSimple } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExportJobStatusBadge } from './export-job-status-badge';
import type { ExportJob } from '@/features/exports/types/export-job.types';

interface ExportsTableProps {
  jobs: ExportJob[];
  onDownload: (jobId: string) => void;
  isDownloadPending: boolean;
}

export function ExportsTable({ jobs, onDownload, isDownloadPending }: ExportsTableProps) {
  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">No export jobs yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead>Completed</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-mono text-xs">{job.type}</TableCell>
            <TableCell>
              <ExportJobStatusBadge status={job.status} />
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {job.fileName ?? '—'}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(job.createdAt).toLocaleString()}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {job.completedAt ? new Date(job.completedAt).toLocaleString() : '—'}
            </TableCell>
            <TableCell>
              {job.status === 'COMPLETED' && job.storageKey && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDownload(job.id)}
                  disabled={isDownloadPending}
                >
                  <DownloadSimple size={14} />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
