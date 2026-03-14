'use client';

import { useState } from 'react';
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
import { EditChargeDialog } from './edit-charge-dialog';
import type { OperationCharge } from '@/features/operation-charges/types/operation-charge.types';
import type { UpdateChargeFormData } from '@/features/operation-charges/schemas/operation-charge.schemas';

interface OperationChargesTableProps {
  charges: OperationCharge[];
  canManage: boolean;
  onEdit: (chargeId: string, dto: UpdateChargeFormData) => void;
  onDeactivate: (chargeId: string) => void;
  isEditPending: boolean;
  isDeactivatePending: boolean;
}

export function OperationChargesTable({
  charges,
  canManage,
  onEdit,
  onDeactivate,
  isEditPending,
  isDeactivatePending,
}: OperationChargesTableProps) {
  const [editingCharge, setEditingCharge] = useState<OperationCharge | null>(null);

  if (charges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No charges recorded yet.</p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            {canManage && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell className="font-medium">{charge.type}</TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate">
                {charge.description ?? '—'}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {parseFloat(charge.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>{charge.currency}</TableCell>
              <TableCell>
                <span
                  className={
                    charge.status === 'ACTIVE'
                      ? 'text-xs font-medium text-green-600 dark:text-green-400'
                      : 'text-xs font-medium text-muted-foreground'
                  }
                >
                  {charge.status}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(charge.createdAt).toLocaleDateString()}
              </TableCell>
              {canManage && (
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    {charge.status === 'ACTIVE' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditingCharge(charge)}
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
                              <AlertDialogTitle>Deactivate charge?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This charge will be marked as inactive and excluded from the
                                finance summary.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeactivate(charge.id)}
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

      {editingCharge && (
        <EditChargeDialog
          charge={editingCharge}
          open={!!editingCharge}
          onOpenChange={(open) => { if (!open) setEditingCharge(null); }}
          onSubmit={(dto) => {
            onEdit(editingCharge.id, dto);
            setEditingCharge(null);
          }}
          isPending={isEditPending}
        />
      )}
    </>
  );
}
