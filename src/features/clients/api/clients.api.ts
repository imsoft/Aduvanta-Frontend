import { apiClient } from '@/lib/api-client';
import type { Client } from '../types/client.types';
import type { CreateClientFormData, UpdateClientFormData } from '../schemas/client.schemas';

export interface ListClientsParams {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  limit?: number;
  offset?: number;
}

export const clientsApi = {
  list: async (orgId: string, params?: ListClientsParams): Promise<Client[]> => {
    const { data } = await apiClient.get<Client[]>('/api/clients', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, clientId: string): Promise<Client> => {
    const { data } = await apiClient.get<Client>(`/api/clients/${clientId}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (orgId: string, dto: CreateClientFormData): Promise<Client> => {
    const { data } = await apiClient.post<Client>('/api/clients', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  update: async (
    orgId: string,
    clientId: string,
    dto: UpdateClientFormData,
  ): Promise<Client> => {
    const { data } = await apiClient.patch<Client>(`/api/clients/${clientId}`, dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  deactivate: async (orgId: string, clientId: string): Promise<void> => {
    await apiClient.delete(`/api/clients/${clientId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
