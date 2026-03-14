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
  assignOperationSchema,
  type AssignOperationFormData,
} from '@/features/operations/schemas/operation.schemas';

interface AssignableMember {
  id: string;
  name: string;
}

interface AssignOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAssignedUserId: string | null;
  members: AssignableMember[];
  onSubmit: (data: AssignOperationFormData) => void;
  isPending: boolean;
}

export function AssignOperationDialog({
  open,
  onOpenChange,
  currentAssignedUserId,
  members,
  onSubmit,
  isPending,
}: AssignOperationDialogProps) {
  const { handleSubmit, setValue } = useForm<AssignOperationFormData>({
    resolver: standardSchemaResolver(assignOperationSchema),
    defaultValues: { assignedUserId: currentAssignedUserId },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign operation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Assign to</Label>
            <Select
              defaultValue={currentAssignedUserId ?? '_none'}
              onValueChange={(v) =>
                setValue('assignedUserId', v === '_none' ? null : v)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Unassigned</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {isPending ? 'Saving…' : 'Save assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
