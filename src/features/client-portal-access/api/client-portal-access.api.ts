import { apiClient } from '@/lib/api-client';
import type { ClientPortalAccess } from '../types/client-portal-access.types';

export const clientPortalAccessApi = {
  listForClient: async (orgId: string, clientId: string): Promise<ClientPortalAccess[]> => {
    const { data } = await apiClient.get<ClientPortalAccess[]>('/api/client-portal-access', {
      params: { clientId },
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  grant: async (
    orgId: string,
    dto: { clientId: string; userId: string },
  ): Promise<ClientPortalAccess> => {
    const { data } = await apiClient.post<ClientPortalAccess>('/api/client-portal-access', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  revoke: async (orgId: string, accessId: string): Promise<void> => {
    await apiClient.delete(`/api/client-portal-access/${accessId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
