import { apiClient } from '@/lib/api-client';
import type { Integration } from '../types/integration.types';
import type { CreateIntegrationFormData, UpdateIntegrationFormData } from '../schemas/integration.schemas';

export interface ListIntegrationsParams {
  status?: 'ACTIVE' | 'INACTIVE';
  provider?: 'WEBHOOK';
}

export const integrationsApi = {
  list: async (orgId: string, params?: ListIntegrationsParams): Promise<Integration[]> => {
    const { data } = await apiClient.get<Integration[]>('/api/integrations', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (orgId: string, dto: CreateIntegrationFormData): Promise<Integration> => {
    const { data } = await apiClient.post<Integration>('/api/integrations', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, integrationId: string): Promise<Integration> => {
    const { data } = await apiClient.get<Integration>(
      `/api/integrations/${integrationId}`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    integrationId: string,
    dto: UpdateIntegrationFormData,
  ): Promise<Integration> => {
    const { data } = await apiClient.patch<Integration>(
      `/api/integrations/${integrationId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  deactivate: async (orgId: string, integrationId: string): Promise<void> => {
    await apiClient.delete(`/api/integrations/${integrationId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
