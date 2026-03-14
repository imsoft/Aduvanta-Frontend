import { apiClient } from '@/lib/api-client';
import type { ExportJob } from '../types/export-job.types';
import type { CreateExportJobFormData } from '../schemas/export-job.schemas';

export const exportsApi = {
  list: async (orgId: string, params?: { status?: string; type?: string }): Promise<ExportJob[]> => {
    const { data } = await apiClient.get<ExportJob[]>('/api/exports', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (orgId: string, dto: CreateExportJobFormData): Promise<ExportJob> => {
    const { data } = await apiClient.post<ExportJob>('/api/exports', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, exportJobId: string): Promise<ExportJob> => {
    const { data } = await apiClient.get<ExportJob>(`/api/exports/${exportJobId}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getDownloadUrl: async (orgId: string, exportJobId: string): Promise<{ url: string }> => {
    const { data } = await apiClient.get<{ url: string }>(
      `/api/exports/${exportJobId}/download-url`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
