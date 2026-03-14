'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createOperationSchema,
  type CreateOperationFormData,
} from '@/features/operations/schemas/operation.schemas';
import type { Client } from '@/features/clients/types/client.types';
interface AssignableMember {
  id: string;
  name: string;
}

interface OperationFormProps {
  clients: Client[];
  members: AssignableMember[];
  onSubmit: (data: CreateOperationFormData) => void;
  isPending: boolean;
  submitLabel: string;
  onCancel?: () => void;
}

export function OperationForm({
  clients,
  members,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: OperationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOperationFormData>({
    resolver: standardSchemaResolver(createOperationSchema),
    defaultValues: {
      type: 'IMPORT',
      priority: 'MEDIUM',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Client */}
        <div className="space-y-1.5">
          <Label>Client *</Label>
          <Select
            onValueChange={(v) => setValue('clientId', v)}
            value={watch('clientId')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clientId && (
            <p className="text-xs text-destructive">{errors.clientId.message}</p>
          )}
        </div>

        {/* Reference */}
        <div className="space-y-1.5">
          <Label htmlFor="reference">Reference *</Label>
          <Input id="reference" {...register('reference')} />
          {errors.reference && (
            <p className="text-xs text-destructive">{errors.reference.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label>Type *</Label>
          <Select
            onValueChange={(v) =>
              setValue('type', v as CreateOperationFormData['type'])
            }
            value={watch('type')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMPORT">Import</SelectItem>
              <SelectItem value="EXPORT">Export</SelectItem>
              <SelectItem value="INTERNAL">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <Label>Priority *</Label>
          <Select
            onValueChange={(v) =>
              setValue('priority', v as CreateOperationFormData['priority'])
            }
            value={watch('priority')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assigned user */}
        <div className="space-y-1.5">
          <Label>Assign to</Label>
          <Select
            onValueChange={(v) => setValue('assignedUserId', v === '_none' ? '' : v)}
            value={watch('assignedUserId') || '_none'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unassigned" />
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

        {/* Due date */}
        <div className="space-y-1.5">
          <Label htmlFor="dueAt">Due date</Label>
          <Input id="dueAt" type="date" {...register('dueAt')} />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={3}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register('description')}
        />
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
