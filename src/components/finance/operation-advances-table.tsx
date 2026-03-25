'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PencilSimple, Trash } from '@phosphor-icons/react';
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
import { EditAdvanceDialog } from './edit-advance-dialog';
import type { OperationAdvance } from '@/features/operation-advances/types/operation-advance.types';
import type { UpdateAdvanceFormData } from '@/features/operation-advances/schemas/operation-advance.schemas';

interface OperationAdvancesTableProps {
  advances: OperationAdvance[];
  canManage: boolean;
  onEdit: (advanceId: string, dto: UpdateAdvanceFormData) => void;
  onDeactivate: (advanceId: string) => void;
  isEditPending: boolean;
  isDeactivatePending: boolean;
}

export function OperationAdvancesTable({
  advances,
  canManage,
  onEdit,
  onDeactivate,
  isEditPending,
  isDeactivatePending,
}: OperationAdvancesTableProps) {
  const tCommon = useTranslations('common');
  const [editingAdvance, setEditingAdvance] = useState<OperationAdvance | null>(null);

  if (advances.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No advances recorded yet.</p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Received at</TableHead>
            <TableHead>Status</TableHead>
            {canManage && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {advances.map((advance) => (
            <TableRow key={advance.id}>
              <TableCell className="text-right tabular-nums">
                {parseFloat(advance.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>{advance.currency}</TableCell>
              <TableCell className="text-muted-foreground">
                {advance.reference ?? '—'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(advance.receivedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={
                    advance.status === 'ACTIVE'
                      ? 'text-xs font-medium text-green-600 dark:text-green-400'
                      : 'text-xs font-medium text-muted-foreground'
                  }
                >
                  {advance.status}
                </span>
              </TableCell>
              {canManage && (
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    {advance.status === 'ACTIVE' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditingAdvance(advance)}
                        >
                          <PencilSimple size={14} />
                        </Button>
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
                              <AlertDialogTitle>Deactivate advance?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This advance will be marked as inactive and excluded from the
                                finance summary.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeactivate(advance.id)}
                                disabled={isDeactivatePending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingAdvance && (
        <EditAdvanceDialog
          advance={editingAdvance}
          open={!!editingAdvance}
          onOpenChange={(open) => { if (!open) setEditingAdvance(null); }}
          onSubmit={(dto) => {
            onEdit(editingAdvance.id, dto);
            setEditingAdvance(null);
          }}
          isPending={isEditPending}
        />
      )}
    </>
  );
}
