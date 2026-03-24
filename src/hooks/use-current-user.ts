import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  isSystemAdmin: boolean;
}

async function fetchMe(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>('/api/users/me');
  return data;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIsSystemAdmin(): boolean {
  const { data } = useCurrentUser();
  return data?.isSystemAdmin ?? false;
}
