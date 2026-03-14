import { apiClient } from '@/lib/api-client';
import type { Operation, OperationStatusHistory, Document, PortalComment } from '../types/portal.types';

export interface ListPortalOperationsParams {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const portalApi = {
  listOperations: async (
    orgId: string,
    params?: ListPortalOperationsParams,
  ): Promise<Operation[]> => {
    const { data } = await apiClient.get<Operation[]>('/api/portal/operations', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getOperation: async (orgId: string, operationId: string): Promise<Operation> => {
    const { data } = await apiClient.get<Operation>(`/api/portal/operations/${operationId}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getStatusHistory: async (
    orgId: string,
    operationId: string,
  ): Promise<OperationStatusHistory[]> => {
    const { data } = await apiClient.get<OperationStatusHistory[]>(
      `/api/portal/operations/${operationId}/history`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  listComments: async (orgId: string, operationId: string): Promise<PortalComment[]> => {
    const { data } = await apiClient.get<PortalComment[]>(
      `/api/portal/operations/${operationId}/comments`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  listDocuments: async (orgId: string, operationId: string): Promise<Document[]> => {
    const { data } = await apiClient.get<Document[]>(
      `/api/portal/operations/${operationId}/documents`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  getDocumentDownloadUrl: async (
    orgId: string,
    documentId: string,
  ): Promise<{ url: string; expiresInSeconds: number }> => {
    const { data } = await apiClient.get<{ url: string; expiresInSeconds: number }>(
      `/api/portal/documents/${documentId}/download-url`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
