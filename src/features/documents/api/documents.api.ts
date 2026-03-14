import { apiClient } from '@/lib/api-client';
import type { Document, DocumentVersion } from '../types/document.types';
import type { UpdateDocumentFormData } from '../schemas/document.schemas';

export interface ListDocumentsParams {
  search?: string;
  categoryId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const documentsApi = {
  listForOperation: async (
    orgId: string,
    operationId: string,
    params?: ListDocumentsParams,
  ): Promise<Document[]> => {
    const { data } = await apiClient.get<Document[]>(
      `/api/operations/${operationId}/documents`,
      { params, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  upload: async (
    orgId: string,
    operationId: string,
    file: File,
    meta: { name?: string; description?: string; categoryId?: string },
  ): Promise<Document> => {
    const form = new FormData();
    form.append('file', file);
    if (meta.name) form.append('name', meta.name);
    if (meta.description) form.append('description', meta.description);
    if (meta.categoryId) form.append('categoryId', meta.categoryId);

    const { data } = await apiClient.post<Document>(
      `/api/operations/${operationId}/documents`,
      form,
      {
        headers: {
          'x-organization-id': orgId,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  },

  getById: async (orgId: string, documentId: string): Promise<Document> => {
    const { data } = await apiClient.get<Document>(`/api/documents/${documentId}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  update: async (
    orgId: string,
    documentId: string,
    dto: UpdateDocumentFormData,
  ): Promise<Document> => {
    const { data } = await apiClient.patch<Document>(
      `/api/documents/${documentId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  deactivate: async (orgId: string, documentId: string): Promise<void> => {
    await apiClient.delete(`/api/documents/${documentId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },

  getVersions: async (
    orgId: string,
    documentId: string,
  ): Promise<DocumentVersion[]> => {
    const { data } = await apiClient.get<DocumentVersion[]>(
      `/api/documents/${documentId}/versions`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  uploadVersion: async (
    orgId: string,
    documentId: string,
    file: File,
  ): Promise<Document> => {
    const form = new FormData();
    form.append('file', file);

    const { data } = await apiClient.post<Document>(
      `/api/documents/${documentId}/versions`,
      form,
      {
        headers: {
          'x-organization-id': orgId,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  },

  getDownloadUrl: async (
    orgId: string,
    documentId: string,
  ): Promise<{ url: string; expiresInSeconds: number }> => {
    const { data } = await apiClient.get<{ url: string; expiresInSeconds: number }>(
      `/api/documents/${documentId}/download-url`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
