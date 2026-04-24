import { apiClient } from '@/lib/api-client';

export interface ImmexProgram {
  id: string;
  organizationId: string;
  clientId: string;
  programNumber: string;
  programType: string;
  status: string;
  companyName: string;
  rfc: string;
  approvalDate: string | null;
  expirationDate: string | null;
  annualExportCommitmentUsd: string | null;
  authorizedCountries: string[] | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ImmexAuthorizedProduct {
  id: string;
  immexProgramId: string;
  tariffFraction: string;
  description: string | null;
  unitOfMeasure: string | null;
  maxAnnualQuantity: string | null;
  maxAnnualValueUsd: string | null;
}

export const immexProgramsApi = {
  list: async (
    orgId: string,
    params?: { clientId?: string; status?: string; programType?: string; limit?: number; offset?: number },
  ): Promise<{ programs: ImmexProgram[]; total: number }> => {
    const { data } = await apiClient.get('/api/immex-programs', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, id: string): Promise<ImmexProgram> => {
    const { data } = await apiClient.get(`/api/immex-programs/${id}`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (
    orgId: string,
    dto: {
      clientId: string;
      programNumber: string;
      programType: string;
      companyName: string;
      rfc: string;
      status?: string;
      approvalDate?: string;
      expirationDate?: string;
      annualExportCommitmentUsd?: string;
      notes?: string;
    },
  ): Promise<ImmexProgram> => {
    const { data } = await apiClient.post('/api/immex-programs', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  update: async (
    orgId: string,
    id: string,
    dto: Partial<{
      status: string;
      expirationDate: string;
      annualExportCommitmentUsd: string;
      notes: string;
    }>,
  ): Promise<ImmexProgram> => {
    const { data } = await apiClient.patch(`/api/immex-programs/${id}`, dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  listExpiring: async (
    orgId: string,
    days: number,
  ): Promise<{ programs: ImmexProgram[]; total: number }> => {
    const { data } = await apiClient.get('/api/immex-programs/expiring', {
      params: { days },
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getProducts: async (orgId: string, id: string): Promise<ImmexAuthorizedProduct[]> => {
    const { data } = await apiClient.get(`/api/immex-programs/${id}/products`, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },
};
