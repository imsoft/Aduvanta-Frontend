import { apiClient } from '@/lib/api-client';

export interface CustomsInspection {
  id: string;
  organizationId: string;
  operationId: string | null;
  entryId: string | null;
  inspectionType: string;
  result: string | null;
  semaphoreColor: string | null;
  inspectorName: string | null;
  inspectorId: string | null;
  customsOffice: string | null;
  inspectionDate: string | null;
  completedAt: string | null;
  actaNumber: string | null;
  discrepanciesFound: boolean;
  penaltyAmount: string | null;
  penaltyCurrency: string | null;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
}

export const customsInspectionsApi = {
  list: async (
    orgId: string,
    params?: {
      operationId?: string;
      entryId?: string;
      result?: string;
      semaphoreColor?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ inspections: CustomsInspection[]; total: number }> => {
    const { data } = await apiClient.get('/api/customs-inspections', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, id: string): Promise<CustomsInspection> => {
    const { data } = await apiClient.get(`/api/customs-inspections/${id}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (
    orgId: string,
    dto: {
      operationId?: string;
      entryId?: string;
      inspectionType: string;
      inspectionDate?: string;
      customsOffice?: string;
      inspectorName?: string;
      inspectorId?: string;
      observations?: string;
    },
  ): Promise<CustomsInspection> => {
    const { data } = await apiClient.post('/api/customs-inspections', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  recordSemaphore: async (
    orgId: string,
    id: string,
    dto: {
      semaphoreColor: 'GREEN' | 'RED';
      result?: string;
      actaNumber?: string;
      discrepanciesFound?: boolean;
      penaltyAmount?: string;
      observations?: string;
    },
  ): Promise<CustomsInspection> => {
    const { data } = await apiClient.post(`/api/customs-inspections/${id}/semaphore`, dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },
};
