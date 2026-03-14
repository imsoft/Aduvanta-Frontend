import { apiClient } from '@/lib/api-client';
import type { ClientContact } from '../types/client-contact.types';
import type { ClientContactFormData } from '../schemas/client-contact.schemas';

export const clientContactsApi = {
  list: async (orgId: string, clientId: string): Promise<ClientContact[]> => {
    const { data } = await apiClient.get<ClientContact[]>(
      `/api/clients/${clientId}/contacts`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    clientId: string,
    dto: ClientContactFormData,
  ): Promise<ClientContact> => {
    const { data } = await apiClient.post<ClientContact>(
      `/api/clients/${clientId}/contacts`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    clientId: string,
    contactId: string,
    dto: ClientContactFormData,
  ): Promise<ClientContact> => {
    const { data } = await apiClient.patch<ClientContact>(
      `/api/clients/${clientId}/contacts/${contactId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  remove: async (
    orgId: string,
    clientId: string,
    contactId: string,
  ): Promise<void> => {
    await apiClient.delete(`/api/clients/${clientId}/contacts/${contactId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
