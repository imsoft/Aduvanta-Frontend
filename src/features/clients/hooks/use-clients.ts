import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { clientsApi, type ListClientsParams } from '../api/clients.api';
import type { CreateClientFormData, UpdateClientFormData } from '../schemas/client.schemas';

export function useClients(params?: ListClientsParams) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['clients', activeOrgId, params],
    queryFn: () => clientsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useClient(clientId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['clients', activeOrgId, clientId],
    queryFn: () => clientsApi.getById(activeOrgId!, clientId),
    enabled: !!activeOrgId && !!clientId,
  });
}

export function useCreateClient() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateClientFormData) =>
      clientsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', activeOrgId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to create client');
    },
  });
}

export function useUpdateClient(clientId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateClientFormData) =>
      clientsApi.update(activeOrgId!, clientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', activeOrgId] });
      toast.success('Client updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to update client');
    },
  });
}

export function useDeactivateClient() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) =>
      clientsApi.deactivate(activeOrgId!, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', activeOrgId] });
      toast.success('Client deactivated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to deactivate client');
    },
  });
}
