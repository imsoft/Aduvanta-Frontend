import { apiClient } from '@/lib/api-client';
import type { Shipment, ListShipmentsResult } from '../types/shipment.types';

export interface ListShipmentsParams {
  limit?: number;
  offset?: number;
  q?: string;
  status?: string;
  type?: string;
}

export const shipmentsApi = {
  list: async (
    orgId: string,
    params?: ListShipmentsParams,
  ): Promise<ListShipmentsResult> => {
    const { data } = await apiClient.get<ListShipmentsResult>('/api/shipments', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  search: async (
    orgId: string,
    q: string,
    limit = 20,
  ): Promise<ListShipmentsResult> => {
    const { data } = await apiClient.get<ListShipmentsResult>(
      '/api/shipments/search',
      { params: { q, limit }, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  getById: async (orgId: string, id: string): Promise<Shipment> => {
    const { data } = await apiClient.get<Shipment>(`/api/shipments/${id}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (
    orgId: string,
    dto: {
      type: string;
      clientReference?: string;
      clientName?: string;
      goodsDescription?: string;
      originCountry?: string;
      destinationCountry?: string;
      carrierName?: string;
      billOfLading?: string;
      notes?: string;
    },
  ): Promise<Shipment> => {
    const { data } = await apiClient.post<Shipment>('/api/shipments', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  update: async (
    orgId: string,
    id: string,
    dto: Partial<{
      clientReference: string;
      clientName: string;
      goodsDescription: string;
      originCountry: string;
      originCity: string;
      destinationCountry: string;
      destinationCity: string;
      carrierName: string;
      vesselName: string;
      billOfLading: string;
      containerNumbers: string;
      notes: string;
    }>,
  ): Promise<Shipment> => {
    const { data } = await apiClient.patch<Shipment>(`/api/shipments/${id}`, dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  changeStatus: async (
    orgId: string,
    id: string,
    status: string,
    reason?: string,
  ): Promise<Shipment> => {
    const { data } = await apiClient.post<Shipment>(
      `/api/shipments/${id}/status`,
      { status, reason },
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  addStage: async (
    orgId: string,
    id: string,
    dto: { stageName: string; location?: string; notes?: string },
  ) => {
    const { data } = await apiClient.post(
      `/api/shipments/${id}/stages`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  addComment: async (orgId: string, id: string, comment: string) => {
    const { data } = await apiClient.post(
      `/api/shipments/${id}/comments`,
      { comment },
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  delete: async (orgId: string, id: string): Promise<void> => {
    await apiClient.delete(`/api/shipments/${id}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
