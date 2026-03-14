import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { clientAddressesApi } from '../api/client-addresses.api';
import type { ClientAddressFormData } from '../schemas/client-address.schemas';

export function useClientAddresses(clientId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['client-addresses', activeOrgId, clientId],
    queryFn: () => clientAddressesApi.list(activeOrgId!, clientId),
    enabled: !!activeOrgId && !!clientId,
  });
}

export function useCreateClientAddress(clientId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ClientAddressFormData) =>
      clientAddressesApi.create(activeOrgId!, clientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-addresses', activeOrgId, clientId],
      });
      toast.success('Address added');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to add address');
    },
  });
}

export function useUpdateClientAddress(clientId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      dto,
    }: {
      addressId: string;
      dto: ClientAddressFormData;
    }) => clientAddressesApi.update(activeOrgId!, clientId, addressId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-addresses', activeOrgId, clientId],
      });
      toast.success('Address updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to update address');
    },
  });
}

export function useRemoveClientAddress(clientId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      clientAddressesApi.remove(activeOrgId!, clientId, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-addresses', activeOrgId, clientId],
      });
      toast.success('Address removed');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to remove address');
    },
  });
}
