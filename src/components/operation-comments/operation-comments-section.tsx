'use client';

import { ChatCircle } from '@phosphor-icons/react';
import { AddOperationCommentForm } from './add-operation-comment-form';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/loading-skeletons';
import {
  useOperationComments,
  useCreateOperationComment,
} from '@/features/operation-comments/hooks/use-operation-comments';

interface OperationCommentsSectionProps {
  operationId: string;
  canComment: boolean;
}

export function OperationCommentsSection({
  operationId,
  canComment,
}: OperationCommentsSectionProps) {
  const { data: comments = [], isLoading } = useOperationComments(operationId);
  const createComment = useCreateOperationComment(operationId);

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Comments</h2>

      {isLoading && <ListSkeleton rows={3} />}

      {!isLoading && comments.length === 0 && (
        <EmptyState icon={<ChatCircle size={20} />} title="No comments yet." />
      )}

      {!isLoading && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border p-4 space-y-1">
              <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {canComment && (
        <div className="pt-2">
          <AddOperationCommentForm
            onSubmit={(data) => createComment.mutate(data)}
            isPending={createComment.isPending}
          />
        </div>
      )}
    </div>
  );
}
