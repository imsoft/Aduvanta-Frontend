'use client';

import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { OperationFinanceSummaryCards } from './operation-finance-summary-cards';
import { OperationChargesTable } from './operation-charges-table';
import { OperationAdvancesTable } from './operation-advances-table';
import { CreateChargeDialog } from './create-charge-dialog';
import { CreateAdvanceDialog } from './create-advance-dialog';
import {
  useOperationCharges,
  useCreateCharge,
  useUpdateCharge,
  useDeactivateCharge,
} from '@/features/operation-charges/hooks/use-operation-charges';
import {
  useOperationAdvances,
  useCreateAdvance,
  useUpdateAdvance,
  useDeactivateAdvance,
} from '@/features/operation-advances/hooks/use-operation-advances';
import type { CreateChargeFormData, UpdateChargeFormData } from '@/features/operation-charges/schemas/operation-charge.schemas';
import type { CreateAdvanceFormData, UpdateAdvanceFormData } from '@/features/operation-advances/schemas/operation-advance.schemas';
import { TableSkeleton } from '@/components/ui/loading-skeletons';

interface OperationFinanceSectionProps {
  operationId: string;
  canManage: boolean;
}

export function OperationFinanceSection({
  operationId,
  canManage,
}: OperationFinanceSectionProps) {
  const [createChargeOpen, setCreateChargeOpen] = useState(false);
  const [createAdvanceOpen, setCreateAdvanceOpen] = useState(false);

  const { data: charges = [], isLoading: chargesLoading } = useOperationCharges(operationId);
  const { data: advances = [], isLoading: advancesLoading } = useOperationAdvances(operationId);

  const createCharge = useCreateCharge(operationId);
  const updateCharge = useUpdateCharge(operationId);
  const deactivateCharge = useDeactivateCharge(operationId);

  const createAdvance = useCreateAdvance(operationId);
  const updateAdvance = useUpdateAdvance(operationId);
  const deactivateAdvance = useDeactivateAdvance(operationId);

  function handleCreateCharge(dto: CreateChargeFormData) {
    createCharge.mutate(dto, { onSuccess: () => setCreateChargeOpen(false) });
  }

  function handleUpdateCharge(chargeId: string, dto: UpdateChargeFormData) {
    updateCharge.mutate({ chargeId, dto });
  }

  function handleCreateAdvance(dto: CreateAdvanceFormData) {
    createAdvance.mutate(dto, { onSuccess: () => setCreateAdvanceOpen(false) });
  }

  function handleUpdateAdvance(advanceId: string, dto: UpdateAdvanceFormData) {
    updateAdvance.mutate({ advanceId, dto });
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Summary</h2>
        <OperationFinanceSummaryCards operationId={operationId} />
      </section>

      {/* Charges */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Charges</h2>
          {canManage && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCreateChargeOpen(true)}
              className="gap-2"
            >
              <Plus size={14} />
              Add charge
            </Button>
          )}
        </div>
        {chargesLoading ? (
          <TableSkeleton rows={3} columns={5} />
        ) : (
          <OperationChargesTable
            charges={charges}
            canManage={canManage}
            onEdit={handleUpdateCharge}
            onDeactivate={(id) => deactivateCharge.mutate(id)}
            isEditPending={updateCharge.isPending}
            isDeactivatePending={deactivateCharge.isPending}
          />
        )}
      </section>

      {/* Advances */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Advances</h2>
          {canManage && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCreateAdvanceOpen(true)}
              className="gap-2"
            >
              <Plus size={14} />
              Register advance
            </Button>
          )}
        </div>
        {advancesLoading ? (
          <TableSkeleton rows={3} columns={5} />
        ) : (
          <OperationAdvancesTable
            advances={advances}
            canManage={canManage}
            onEdit={handleUpdateAdvance}
            onDeactivate={(id) => deactivateAdvance.mutate(id)}
            isEditPending={updateAdvance.isPending}
            isDeactivatePending={deactivateAdvance.isPending}
          />
        )}
      </section>

      {/* Dialogs */}
      <CreateChargeDialog
        open={createChargeOpen}
        onOpenChange={setCreateChargeOpen}
        onSubmit={handleCreateCharge}
        isPending={createCharge.isPending}
      />
      <CreateAdvanceDialog
        open={createAdvanceOpen}
        onOpenChange={setCreateAdvanceOpen}
        onSubmit={handleCreateAdvance}
        isPending={createAdvance.isPending}
      />
    </div>
  );
}
