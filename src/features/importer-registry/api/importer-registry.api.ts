import { apiClient } from '@/lib/api-client';

export interface ImporterRegistry {
  id: string;
  organizationId: string;
  clientId: string;
  rfc: string;
  businessName: string;
  registryType: string;
  status: string;
  satFolio: string | null;
  inscriptionDate: string | null;
  expirationDate: string | null;
  suspensionDate: string | null;
  suspensionReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ImporterRegistrySector {
  id: string;
  importerRegistryId: string;
  sectorKey: string;
  sectorName: string | null;
  authorizedAt: string | null;
  expiresAt: string | null;
}

export const importerRegistryApi = {
  list: async (
    orgId: string,
    params?: { clientId?: string; status?: string; expiringDays?: number; limit?: number; offset?: number },
  ): Promise<{ records: ImporterRegistry[]; total: number }> => {
    const { data } = await apiClient.get('/api/importer-registry', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, id: string): Promise<ImporterRegistry> => {
    const { data } = await apiClient.get(`/api/importer-registry/${id}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (
    orgId: string,
    dto: {
      clientId: string;
      rfc: string;
      businessName: string;
      registryType: string;
      status?: string;
      satFolio?: string;
      inscriptionDate?: string;
      expirationDate?: string;
      notes?: string;
    },
  ): Promise<ImporterRegistry> => {
    const { data } = await apiClient.post('/api/importer-registry', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  update: async (
    orgId: string,
    id: string,
    dto: Partial<{
      status: string;
      satFolio: string;
      inscriptionDate: string;
      expirationDate: string;
      suspensionDate: string;
      suspensionReason: string;
      notes: string;
    }>,
  ): Promise<ImporterRegistry> => {
    const { data } = await apiClient.patch(`/api/importer-registry/${id}`, dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  listExpiring: async (
    orgId: string,
    days: number,
  ): Promise<{ records: ImporterRegistry[]; total: number }> => {
    const { data } = await apiClient.get('/api/importer-registry/expiring', {
      params: { days },
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getSectors: async (orgId: string, id: string): Promise<ImporterRegistrySector[]> => {
    const { data } = await apiClient.get(`/api/importer-registry/${id}/sectors`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },
};
