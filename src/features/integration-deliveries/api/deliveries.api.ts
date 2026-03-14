import { apiClient } from '@/lib/api-client';
import type { IntegrationDelivery } from '../types/delivery.types';

export const deliveriesApi = {
  listForIntegration: async (
    orgId: string,
    integrationId: string,
    params?: { status?: string },
  ): Promise<IntegrationDelivery[]> => {
    const { data } = await apiClient.get<IntegrationDelivery[]>(
      `/api/integrations/${integrationId}/deliveries`,
      { params, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  retry: async (orgId: string, deliveryId: string): Promise<IntegrationDelivery> => {
    const { data } = await apiClient.post<IntegrationDelivery>(
      `/api/integration-deliveries/${deliveryId}/retry`,
      {},
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
