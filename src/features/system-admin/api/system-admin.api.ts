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

export interface EntryRow {
  id: string;
  entryNumber: string | null;
  entryKey: string | null;
  regime: string | null;
  status: string;
  grandTotal: string | null;
  internalReference: string | null;
  organizationId: string;
  organizationSlug: string | null;
  createdAt: string;
}

export interface OperationRow {
  id: string;
  reference: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  organizationId: string;
  organizationSlug: string | null;
  createdAt: string;
}

export interface AuditLogRow {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  actorId: string | null;
  organizationId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface FeatureFlagRow {
  id: string;
  key: string;
  description: string | null;
  isEnabled: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrgUsageRow {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  memberCount: number;
  entryCount: number;
  operationCount: number;
  entriesThisMonth: number;
  subscriptionStatus: string | null;
  planName: string | null;
}

export interface SessionRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  isSystemAdmin: boolean;
}

export interface SubscriptionRow {
  id: string;
  organizationId: string;
  organizationName: string | null;
  organizationSlug: string | null;
  status: string;
  billingInterval: string | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  planName: string | null;
  planCode: string | null;
  priceMonthly: string | null;
  priceYearly: string | null;
  createdAt: string;
}

export interface BillingSummary {
  subscriptions: SubscriptionRow[];
  byPlan: { planName: string | null; planCode: string | null; count: number }[];
  byStatus: { status: string; count: number }[];
}

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  isActive: boolean;
  startsAt: string;
  endsAt: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
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

  listEntries: async (
    limit = 25,
    offset = 0,
    search?: string,
  ): Promise<{ entries: EntryRow[]; total: number }> => {
    const { data } = await apiClient.get('/api/system-admin/entries', {
      params: { limit, offset, search },
    });
    return data as { entries: EntryRow[]; total: number };
  },

  listOperations: async (
    limit = 25,
    offset = 0,
  ): Promise<{ operations: OperationRow[]; total: number }> => {
    const { data } = await apiClient.get('/api/system-admin/operations', {
      params: { limit, offset },
    });
    return data as { operations: OperationRow[]; total: number };
  },

  listAuditLogs: async (
    limit = 50,
    offset = 0,
  ): Promise<{ logs: AuditLogRow[]; total: number }> => {
    const { data } = await apiClient.get('/api/system-admin/audit-logs', {
      params: { limit, offset },
    });
    return data as { logs: AuditLogRow[]; total: number };
  },

  listFeatureFlags: async (): Promise<FeatureFlagRow[]> => {
    const { data } = await apiClient.get('/api/system-admin/feature-flags');
    return data as FeatureFlagRow[];
  },

  setFeatureFlag: async (key: string, isEnabled: boolean, organizationId?: string): Promise<void> => {
    await apiClient.put(`/api/system-admin/feature-flags/${key}`, { isEnabled, organizationId });
  },

  getUsage: async (
    limit = 25,
    offset = 0,
  ): Promise<{ usage: OrgUsageRow[]; total: number }> => {
    const { data } = await apiClient.get('/api/system-admin/usage', {
      params: { limit, offset },
    });
    return data as { usage: OrgUsageRow[]; total: number };
  },

  listSessions: async (
    limit = 50,
    offset = 0,
  ): Promise<{ sessions: SessionRow[]; total: number }> => {
    const { data } = await apiClient.get('/api/system-admin/sessions', {
      params: { limit, offset },
    });
    return data as { sessions: SessionRow[]; total: number };
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/api/system-admin/sessions/${sessionId}`);
  },

  getBilling: async (): Promise<BillingSummary> => {
    const { data } = await apiClient.get('/api/system-admin/billing');
    return data as BillingSummary;
  },

  listAnnouncements: async (): Promise<AnnouncementRow[]> => {
    const { data } = await apiClient.get('/api/system-admin/announcements');
    return data as AnnouncementRow[];
  },

  getActiveAnnouncements: async (): Promise<AnnouncementRow[]> => {
    const { data } = await apiClient.get('/api/system-admin/announcements/active');
    return data as AnnouncementRow[];
  },

  createAnnouncement: async (body: {
    title: string;
    body: string;
    level: 'INFO' | 'WARNING' | 'CRITICAL';
    startsAt?: string;
    endsAt?: string;
  }): Promise<AnnouncementRow> => {
    const { data } = await apiClient.post('/api/system-admin/announcements', body);
    return data as AnnouncementRow;
  },

  updateAnnouncement: async (
    id: string,
    body: Partial<{
      title: string;
      body: string;
      level: 'INFO' | 'WARNING' | 'CRITICAL';
      isActive: boolean;
      startsAt: string;
      endsAt: string | null;
    }>,
  ): Promise<AnnouncementRow> => {
    const { data } = await apiClient.put(`/api/system-admin/announcements/${id}`, body);
    return data as AnnouncementRow;
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/system-admin/announcements/${id}`);
  },

  clearMyAbuseBlock: async (): Promise<{ cleared: boolean }> => {
    const { data } = await apiClient.delete<{ cleared: boolean }>('/api/system-admin/abuse/me');
    return data;
  },
};
