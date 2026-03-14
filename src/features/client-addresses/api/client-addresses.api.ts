import { apiClient } from '@/lib/api-client';
import type { ClientAddress } from '../types/client-address.types';
import type { ClientAddressFormData } from '../schemas/client-address.schemas';

export const clientAddressesApi = {
  list: async (orgId: string, clientId: string): Promise<ClientAddress[]> => {
    const { data } = await apiClient.get<ClientAddress[]>(
      `/api/clients/${clientId}/addresses`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    clientId: string,
    dto: ClientAddressFormData,
  ): Promise<ClientAddress> => {
    const { data } = await apiClient.post<ClientAddress>(
      `/api/clients/${clientId}/addresses`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    clientId: string,
    addressId: string,
    dto: ClientAddressFormData,
  ): Promise<ClientAddress> => {
    const { data } = await apiClient.patch<ClientAddress>(
      `/api/clients/${clientId}/addresses/${addressId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  remove: async (
    orgId: string,
    clientId: string,
    addressId: string,
  ): Promise<void> => {
    await apiClient.delete(`/api/clients/${clientId}/addresses/${addressId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
