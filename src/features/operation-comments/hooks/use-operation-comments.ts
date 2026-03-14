import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { operationCommentsApi } from '../api/operation-comments.api';
import type { CreateOperationCommentFormData } from '../schemas/operation-comment.schemas';

export function useOperationComments(operationId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['operation-comments', activeOrgId, operationId],
    queryFn: () => operationCommentsApi.list(activeOrgId!, operationId),
    enabled: !!activeOrgId && !!operationId,
  });
}

export function useCreateOperationComment(operationId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateOperationCommentFormData) =>
      operationCommentsApi.create(activeOrgId!, operationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['operation-comments', activeOrgId, operationId],
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to add comment');
    },
  });
}
