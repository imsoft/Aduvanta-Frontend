import { apiClient } from '@/lib/api-client';
import type { OperationComment } from '../types/operation-comment.types';
import type { CreateOperationCommentFormData } from '../schemas/operation-comment.schemas';

export const operationCommentsApi = {
  list: async (orgId: string, operationId: string): Promise<OperationComment[]> => {
    const { data } = await apiClient.get<OperationComment[]>(
      `/api/operations/${operationId}/comments`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    operationId: string,
    dto: CreateOperationCommentFormData,
  ): Promise<OperationComment> => {
    const { data } = await apiClient.post<OperationComment>(
      `/api/operations/${operationId}/comments`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
