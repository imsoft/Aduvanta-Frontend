import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useAllEntries(limit = 25, offset = 0, search?: string) {
  return useQuery({
    queryKey: ['system-admin', 'entries', limit, offset, search],
    queryFn: () => systemAdminApi.listEntries(limit, offset, search),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAllOperations(limit = 25, offset = 0) {
  return useQuery({
    queryKey: ['system-admin', 'operations', limit, offset],
    queryFn: () => systemAdminApi.listOperations(limit, offset),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAllAuditLogs(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['system-admin', 'audit-logs', limit, offset],
    queryFn: () => systemAdminApi.listAuditLogs(limit, offset),
    staleTime: 1000 * 30,
  });
}

export function useAllFeatureFlags() {
  return useQuery({
    queryKey: ['system-admin', 'feature-flags'],
    queryFn: () => systemAdminApi.listFeatureFlags(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSetFeatureFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, isEnabled, organizationId }: { key: string; isEnabled: boolean; organizationId?: string }) =>
      systemAdminApi.setFeatureFlag(key, isEnabled, organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-admin', 'feature-flags'] });
    },
  });
}
