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
  const tCommon = useTranslations('common');
  const t = useTranslations('finance');
  const [editingCharge, setEditingCharge] = useState<OperationCharge | null>(null);

  if (charges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t('noCharges')}</p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('columns.type')}</TableHead>
            <TableHead>{t('columns.description')}</TableHead>
            <TableHead className="text-right">{t('columns.amount')}</TableHead>
            <TableHead>{t('columns.currency')}</TableHead>
            <TableHead>{t('columns.status')}</TableHead>
            <TableHead>{t('columns.created')}</TableHead>
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
                              <AlertDialogTitle>{t('dialogs.deactivateChargeTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('dialogs.deactivateChargeDescription')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeactivate(charge.id)}
                                disabled={isDeactivatePending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t('dialogs.deactivate')}
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
