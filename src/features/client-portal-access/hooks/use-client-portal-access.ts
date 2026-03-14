import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { clientPortalAccessApi } from '../api/client-portal-access.api';

export function useClientPortalAccess(clientId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['client-portal-access', activeOrgId, clientId],
    queryFn: () => clientPortalAccessApi.listForClient(activeOrgId!, clientId),
    enabled: !!activeOrgId && !!clientId,
  });
}

export function useGrantPortalAccess(clientId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: { clientId: string; userId: string }) =>
      clientPortalAccessApi.grant(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-portal-access', activeOrgId, clientId],
      });
      toast.success('Portal access granted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to grant portal access');
    },
  });
}

export function useRevokePortalAccess(clientId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accessId: string) => clientPortalAccessApi.revoke(activeOrgId!, accessId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-portal-access', activeOrgId, clientId],
      });
      toast.success('Portal access revoked');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to revoke portal access');
    },
  });
}
