import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { deliveriesApi } from '../api/deliveries.api';

export function useIntegrationDeliveries(
  integrationId: string,
  params?: { status?: string },
) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['deliveries', activeOrgId, integrationId, params],
    queryFn: () => deliveriesApi.listForIntegration(activeOrgId!, integrationId, params),
    enabled: !!activeOrgId && !!integrationId,
  });
}

export function useRetryDelivery(integrationId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) =>
      deliveriesApi.retry(activeOrgId!, deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries', activeOrgId, integrationId] });
      toast.success('Delivery retried');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to retry delivery');
    },
  });
}
