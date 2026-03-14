'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  changeStatusSchema,
  type ChangeStatusFormData,
} from '@/features/operations/schemas/operation.schemas';
import type { OperationStatus } from '@/features/operations/types/operation.types';

interface ChangeOperationStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: OperationStatus;
  onSubmit: (data: ChangeStatusFormData) => void;
  isPending: boolean;
}

const STATUS_OPTIONS: { value: OperationStatus; label: string }[] = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function ChangeOperationStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onSubmit,
  isPending,
}: ChangeOperationStatusDialogProps) {
  const { handleSubmit, setValue, watch, register } = useForm<ChangeStatusFormData>({
    resolver: standardSchemaResolver(changeStatusSchema),
    defaultValues: { status: currentStatus },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>New status</Label>
            <Select
              onValueChange={(v) => setValue('status', v as OperationStatus)}
              defaultValue={currentStatus}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.filter((s) => s.value !== currentStatus).map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment">Comment (optional)</Label>
            <textarea
              id="comment"
              rows={2}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Reason for status change…"
              {...register('comment')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Update status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
