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

export function useOrgUsage(limit = 25, offset = 0) {
  return useQuery({
    queryKey: ['system-admin', 'usage', limit, offset],
    queryFn: () => systemAdminApi.getUsage(limit, offset),
    staleTime: 1000 * 60 * 2,
  });
}

export function useActiveSessions(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['system-admin', 'sessions', limit, offset],
    queryFn: () => systemAdminApi.listSessions(limit, offset),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => systemAdminApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-admin', 'sessions'] });
    },
  });
}

export function useBillingSummary() {
  return useQuery({
    queryKey: ['system-admin', 'billing'],
    queryFn: () => systemAdminApi.getBilling(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllAnnouncements() {
  return useQuery({
    queryKey: ['system-admin', 'announcements'],
    queryFn: () => systemAdminApi.listAnnouncements(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useActiveAnnouncements() {
  return useQuery({
    queryKey: ['system-admin', 'announcements', 'active'],
    queryFn: () => systemAdminApi.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof systemAdminApi.createAnnouncement>[0]) =>
      systemAdminApi.createAnnouncement(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-admin', 'announcements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Parameters<typeof systemAdminApi.updateAnnouncement>[1]) =>
      systemAdminApi.updateAnnouncement(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-admin', 'announcements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => systemAdminApi.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-admin', 'announcements'] });
    },
  });
}

export function useClearMyAbuseBlock() {
  return useMutation({
    mutationFn: () => systemAdminApi.clearMyAbuseBlock(),
  });
}
