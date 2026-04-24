import { apiClient } from '@/lib/api-client';
import type {
  CustomsEntry,
  CustomsEntryDetail,
  CustomsOffice,
  CustomsPatent,
  ListCustomsEntriesResult,
} from '../types/customs-entry.types';

export interface ListEntriesParams {
  limit?: number;
  offset?: number;
  status?: string;
  regime?: string;
  q?: string;
}

export const customsEntriesApi = {
  listOffices: async (): Promise<CustomsOffice[]> => {
    const { data } = await apiClient.get<CustomsOffice[]>(
      '/api/customs-entries/offices',
    );
    return data;
  },

  listPatents: async (orgId: string): Promise<CustomsPatent[]> => {
    const { data } = await apiClient.get<CustomsPatent[]>(
      '/api/customs-entries/patents',
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  list: async (
    orgId: string,
    params?: ListEntriesParams,
  ): Promise<ListCustomsEntriesResult> => {
    const { data } = await apiClient.get<ListCustomsEntriesResult>(
      '/api/customs-entries',
      { params, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  search: async (
    orgId: string,
    q: string,
    params?: { limit?: number; offset?: number },
  ): Promise<ListCustomsEntriesResult> => {
    const { data } = await apiClient.get<ListCustomsEntriesResult>(
      '/api/customs-entries/search',
      { params: { q, ...params }, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  getById: async (
    orgId: string,
    entryId: string,
  ): Promise<CustomsEntryDetail> => {
    const { data } = await apiClient.get<CustomsEntryDetail>(
      `/api/customs-entries/${entryId}`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    dto: {
      customsOfficeId: string;
      patentId: string;
      entryKey: string;
      regime: string;
      operationType: number;
      invoiceCurrency?: string;
      internalReference?: string;
      observations?: string;
    },
  ): Promise<CustomsEntry> => {
    const { data } = await apiClient.post<CustomsEntry>(
      '/api/customs-entries',
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    entryId: string,
    dto: Partial<{
      originCountry: string;
      destinationCountry: string;
      exchangeRate: string;
      transportMode: number;
      carrierName: string;
      transportDocumentNumber: string;
      arrivalDate: string;
      internalReference: string;
      observations: string;
    }>,
  ): Promise<CustomsEntry> => {
    const { data } = await apiClient.patch<CustomsEntry>(
      `/api/customs-entries/${entryId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  changeStatus: async (
    orgId: string,
    entryId: string,
    status: string,
    comment?: string,
  ): Promise<CustomsEntry> => {
    const { data } = await apiClient.post<CustomsEntry>(
      `/api/customs-entries/${entryId}/status`,
      { status, comment },
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  generateSaaiLayout: async (
    orgId: string,
    entryId: string,
  ): Promise<void> => {
    const response = await apiClient.post(
      `/api/saai-generator/entries/${entryId}/generate`,
      {},
      {
        headers: { 'x-organization-id': orgId },
        responseType: 'blob',
      },
    );

    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedimento-${entryId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  },

  validateSaai: async (
    orgId: string,
    entryId: string,
  ): Promise<{ valid: boolean; errors: string[] }> => {
    const { data } = await apiClient.get<{ valid: boolean; errors: string[] }>(
      `/api/saai-generator/entries/${entryId}/validate`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
