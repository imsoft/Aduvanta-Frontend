'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Button } from '@/components/ui/button';
import {
  createOperationCommentSchema,
  type CreateOperationCommentFormData,
} from '@/features/operation-comments/schemas/operation-comment.schemas';

interface AddOperationCommentFormProps {
  onSubmit: (data: CreateOperationCommentFormData) => void;
  isPending: boolean;
}

export function AddOperationCommentForm({
  onSubmit,
  isPending,
}: AddOperationCommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOperationCommentFormData>({
    resolver: standardSchemaResolver(createOperationCommentSchema),
  });

  const submit = (data: CreateOperationCommentFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-2">
      <textarea
        rows={3}
        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        {...register('body')}
      />
      {errors.body && (
        <p className="text-xs text-destructive">{errors.body.message}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Posting…' : 'Post comment'}
        </Button>
      </div>
    </form>
  );
}
