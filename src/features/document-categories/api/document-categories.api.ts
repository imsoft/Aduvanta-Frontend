import { apiClient } from '@/lib/api-client';
import type { DocumentCategory } from '../types/document-category.types';
import type {
  CreateDocumentCategoryFormData,
  UpdateDocumentCategoryFormData,
} from '../schemas/document-category.schemas';

export const documentCategoriesApi = {
  list: async (orgId: string): Promise<DocumentCategory[]> => {
    const { data } = await apiClient.get<DocumentCategory[]>('/api/document-categories', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (
    orgId: string,
    dto: CreateDocumentCategoryFormData,
  ): Promise<DocumentCategory> => {
    const { data } = await apiClient.post<DocumentCategory>(
      '/api/document-categories',
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    categoryId: string,
    dto: UpdateDocumentCategoryFormData,
  ): Promise<DocumentCategory> => {
    const { data } = await apiClient.patch<DocumentCategory>(
      `/api/document-categories/${categoryId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  remove: async (orgId: string, categoryId: string): Promise<void> => {
    await apiClient.delete(`/api/document-categories/${categoryId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
