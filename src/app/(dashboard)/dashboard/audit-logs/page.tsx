'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api-client';
import { useOrgStore } from '@/store/org.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AuditLog {
  id: string;
  actorId: string;
  organizationId: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

const PAGE_SIZE = 20;

async function fetchAuditLogs(
  orgId: string,
  offset: number,
): Promise<AuditLog[]> {
  const { data } = await apiClient.get<AuditLog[]>('/api/audit-logs', {
    params: { limit: PAGE_SIZE, offset },
    headers: { 'x-organization-id': orgId },
  });
  return data;
}

function ActionBadge({ action }: { action: string }) {
  const color = action.includes('created')
    ? 'default'
    : action.includes('removed') || action.includes('deleted')
      ? 'destructive'
      : 'secondary';

  return <Badge variant={color as any}>{action}</Badge>;
}

export default function AuditLogsPage() {
  const { activeOrgId } = useOrgStore();
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs', activeOrgId, offset],
    queryFn: () => fetchAuditLogs(activeOrgId!, offset),
    enabled: !!activeOrgId,
  });

  if (!activeOrgId) {
    return (
      <div className="text-sm text-muted-foreground">
        Select an organization to view audit logs.
      </div>
    );
  }

  const hasPrev = page > 0;
  const hasNext = logs.length === PAGE_SIZE;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Activity history for this organization
        </p>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading…</div>
      )}

      {!isLoading && logs.length === 0 && page === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">No activity recorded yet</p>
        </div>
      )}

      {!isLoading && logs.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="font-medium">{log.resource}</span>
                    <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                      {log.resourceId.slice(0, 8)}…
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.actorId.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrev}
            onClick={() => setPage((p) => p - 1)}
          >
            <CaretLeft size={14} />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <CaretRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
