'use client';

import { Link } from '@/i18n/navigation'
import { ArrowRight, Prohibit } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Integration } from '@/features/integrations/types/integration.types';

interface IntegrationsTableProps {
  integrations: Integration[];
  canManage: boolean;
  onDeactivate: (id: string) => void;
  isDeactivatePending: boolean;
}

export function IntegrationsTable({
  integrations,
  canManage,
  onDeactivate,
  isDeactivatePending,
}: IntegrationsTableProps) {
  if (integrations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No integrations configured yet.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Event types</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {integrations.map((integration) => (
          <TableRow key={integration.id}>
            <TableCell className="font-medium">{integration.name}</TableCell>
            <TableCell className="text-xs font-mono">{integration.provider}</TableCell>
            <TableCell>
              <span
                className={
                  integration.status === 'ACTIVE'
                    ? 'text-xs font-medium text-green-600 dark:text-green-400'
                    : 'text-xs text-muted-foreground'
                }
              >
                {integration.status}
              </span>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {integration.eventTypes
                .split(',')
                .slice(0, 2)
                .join(', ')}
              {integration.eventTypes.split(',').length > 2 &&
                ` +${integration.eventTypes.split(',').length - 2}`}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(integration.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 justify-end">
                <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                  <Link href={`/dashboard/integrations/${integration.id}`}>
                    <ArrowRight size={14} />
                  </Link>
                </Button>
                {canManage && integration.status === 'ACTIVE' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                      >
                        <Prohibit size={14} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate integration?</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{integration.name}" will stop receiving events.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeactivate(integration.id)}
                          disabled={isDeactivatePending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
