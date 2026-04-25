import { useQuery } from '@tanstack/react-query';
import { systemAdminApi } from '../api/system-admin.api';

export function useIsSystemAdmin() {
  return useQuery({
    queryKey: ['system-admin', 'me'],
    queryFn: () => systemAdminApi.getMyStatus(),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}

export function usePlatformOverview() {
  return useQuery({
    queryKey: ['system-admin', 'overview'],
    queryFn: () => systemAdminApi.getOverview(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAllOrganizations(limit = 25, offset = 0) {
  return useQuery({
    queryKey: ['system-admin', 'organizations', limit, offset],
    queryFn: () => systemAdminApi.listOrganizations(limit, offset),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAllUsers(limit = 25, offset = 0, search?: string) {
  return useQuery({
    queryKey: ['system-admin', 'users', limit, offset, search],
    queryFn: () => systemAdminApi.listUsers(limit, offset, search),
    staleTime: 1000 * 60 * 2,
  });
}
