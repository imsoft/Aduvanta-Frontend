import { apiClient } from '@/lib/api-client';
import type { ImportJob } from '../types/import-job.types';

export const importsApi = {
  list: async (orgId: string, params?: { status?: string }): Promise<ImportJob[]> => {
    const { data } = await apiClient.get<ImportJob[]>('/api/imports', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (
    orgId: string,
    type: 'CLIENTS',
    file: File,
  ): Promise<ImportJob> => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    const { data } = await apiClient.post<ImportJob>('/api/imports', formData, {
      headers: {
        'x-organization-id': orgId,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getById: async (orgId: string, importJobId: string): Promise<ImportJob> => {
    const { data } = await apiClient.get<ImportJob>(`/api/imports/${importJobId}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },
};
