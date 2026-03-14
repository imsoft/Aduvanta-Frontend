'use client';

import { Trash } from '@phosphor-icons/react';
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
import type { StatusTransitionRule } from '@/features/compliance-status-rules/types/status-rule.types';

interface StatusRulesTableProps {
  rules: StatusTransitionRule[];
  canManage: boolean;
  onDelete: (id: string) => void;
  isDeletePending: boolean;
}

export function StatusRulesTable({
  rules,
  canManage,
  onDelete,
  isDeletePending,
}: StatusRulesTableProps) {
  if (rules.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No status transition rules defined yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From status</TableHead>
          <TableHead>To status</TableHead>
          <TableHead>Requires all docs</TableHead>
          {canManage && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell className="font-mono text-xs">{rule.fromStatus}</TableCell>
            <TableCell className="font-mono text-xs">{rule.toStatus}</TableCell>
            <TableCell>
              <span
                className={
                  rule.requiresAllRequiredDocuments
                    ? 'text-xs font-medium text-amber-600 dark:text-amber-400'
                    : 'text-xs text-muted-foreground'
                }
              >
                {rule.requiresAllRequiredDocuments ? 'Yes' : 'No'}
              </span>
            </TableCell>
            {canManage && (
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                    >
                      <Trash size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove status rule?</AlertDialogTitle>
                      <AlertDialogDescription>
                        The transition {rule.fromStatus} → {rule.toStatus} will no longer be
                        governed by this rule set.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(rule.id)}
                        disabled={isDeletePending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
