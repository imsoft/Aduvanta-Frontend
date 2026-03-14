'use client';

import { usePortalComments } from '@/features/portal/hooks/use-portal';

interface PortalCommentsSectionProps {
  operationId: string;
}

export function PortalCommentsSection({ operationId }: PortalCommentsSectionProps) {
  const { data: comments = [], isLoading } = usePortalComments(operationId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading comments…</p>;
  }

  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">No comments yet.</p>;
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
