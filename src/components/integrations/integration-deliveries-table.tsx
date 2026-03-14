'use client';

import { ArrowClockwise } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { IntegrationDelivery } from '@/features/integration-deliveries/types/delivery.types';

interface IntegrationDeliveriesTableProps {
  deliveries: IntegrationDelivery[];
  canRetry: boolean;
  onRetry: (deliveryId: string) => void;
  isRetryPending: boolean;
}

const statusColors: Record<string, string> = {
  SUCCESS: 'text-green-600 dark:text-green-400',
  FAILED: 'text-destructive',
  PENDING: 'text-muted-foreground',
};

export function IntegrationDeliveriesTable({
  deliveries,
  canRetry,
  onRetry,
  isRetryPending,
}: IntegrationDeliveriesTableProps) {
  if (deliveries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No delivery records yet.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Response</TableHead>
          <TableHead>Attempts</TableHead>
          <TableHead>Date</TableHead>
          {canRetry && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveries.map((delivery) => (
          <TableRow key={delivery.id}>
            <TableCell className="font-mono text-xs">{delivery.eventType}</TableCell>
            <TableCell>
              <span className={`text-xs font-medium ${statusColors[delivery.status] ?? ''}`}>
                {delivery.status}
              </span>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {delivery.responseStatus ?? '—'}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {delivery.attemptCount}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {delivery.lastAttemptAt
                ? new Date(delivery.lastAttemptAt).toLocaleString()
                : new Date(delivery.createdAt).toLocaleString()}
            </TableCell>
            {canRetry && (
              <TableCell>
                {delivery.status === 'FAILED' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRetry(delivery.id)}
                    disabled={isRetryPending}
                  >
                    <ArrowClockwise size={14} />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
