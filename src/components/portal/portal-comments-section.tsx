'use client';

import { usePortalComments } from '@/features/portal/hooks/use-portal';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/loading-skeletons';

interface PortalCommentsSectionProps {
  operationId: string;
}

export function PortalCommentsSection({ operationId }: PortalCommentsSectionProps) {
  const { data: comments = [], isLoading } = usePortalComments(operationId);

  if (isLoading) {
    return <ListSkeleton rows={3} />;
  }

  if (comments.length === 0) {
    return <EmptyState title="No comments yet." />;
  }

  return (
    <ol className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-md border p-3 space-y-1">
          <p className="text-sm">{comment.body}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ol>
  );
}
