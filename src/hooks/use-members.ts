import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useOrgStore } from '@/store/org.store';
import type { MemberWithUser } from '@/features/memberships/types/membership.types';

export function useMembers() {
  const { activeOrgId } = useOrgStore();

  return useQuery<MemberWithUser[]>({
    queryKey: ['members', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get<MemberWithUser[]>('/api/memberships', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data;
    },
    enabled: !!activeOrgId,
  });
}
