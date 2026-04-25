import { apiClient } from '@/lib/api-client';

export interface PlatformOverview {
  totalOrganizations: number;
  totalUsers: number;
  totalOperations: number;
  activeOperations: number;
  totalEntries: number;
  entriesThisMonth: number;
  recentActivity: { action: string; resource: string; createdAt: string }[];
}

export interface OrgRow {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  memberCount: number;
  operationCount: number;
  entryCount: number;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  orgCount: number;
  isSystemAdmin: boolean;
}

export const systemAdminApi = {
  getMyStatus: async (): Promise<{ isSystemAdmin: boolean }> => {
    const { data } = await apiClient.get('/api/system-admin/me');
    return data as { isSystemAdmin: boolean };
  },

  getOverview: async (): Promise<PlatformOverview> => {
    const { data } = await apiClient.get('/api/system-admin/overview');
    return data as PlatformOverview;
  },

  listOrganizations: async (
    limit = 25,
    offset = 0,
  ): Promise<{ organizations: OrgRow[]; total: number }> => {
    const { data } = await apiClient.get('/api/system-admin/organizations', {
      params: { limit, offset },
    });
    return data as { organizations: OrgRow[]; total: number };
  },

  listUsers: async (
    limit = 25,
    offset = 0,
    search?: string,
  ): Promise<{ users: UserRow[]; total: number }> => {
    const { data } = await apiClient.get('/api/system-admin/users', {
      params: { limit, offset, search },
    });
    return data as { users: UserRow[]; total: number };
  },
};
