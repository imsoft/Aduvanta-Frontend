import { apiClient } from '@/lib/api-client';

export interface AccountMovement {
  id: string;
  clientId: string;
  type: string;
  amount: string;
  currency: string;
  description: string;
  reference: string | null;
  movementDate: string;
  balanceBefore: string | null;
  balanceAfter: string | null;
  operationId: string | null;
  entryId: string | null;
  isReconciled: boolean;
  createdAt: string;
}

export interface AccountStatement {
  id: string;
  clientId: string;
  statementNumber: string;
  status: string;
  periodFrom: string;
  periodTo: string;
  openingBalance: string;
  totalCredits: string;
  totalDebits: string;
  closingBalance: string;
  currency: string;
  movementCount: number;
  sentAt: string | null;
  createdAt: string;
}

export interface ClientBalance {
  clientId: string;
  balance: string;
  currency: string;
  funds: {
    availableBalance: string;
    reservedBalance: string;
    lastMovementAt: string | null;
  } | null;
}

export const clientAccountsApi = {
  getAllBalances: async (orgId: string): Promise<{ clientId: string; balance: string }[]> => {
    const { data } = await apiClient.get('/api/client-accounts/balances', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getBalance: async (orgId: string, clientId: string): Promise<ClientBalance> => {
    const { data } = await apiClient.get(
      `/api/client-accounts/${clientId}/balance`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  listMovements: async (
    orgId: string,
    clientId: string,
    params?: { limit?: number; offset?: number; dateFrom?: string; dateTo?: string },
  ): Promise<{ movements: AccountMovement[]; total: number }> => {
    const { data } = await apiClient.get(
      `/api/client-accounts/${clientId}/movements`,
      { params, headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  recordMovement: async (
    orgId: string,
    dto: {
      clientId: string;
      type: string;
      amount: string;
      currency?: string;
      description: string;
      reference?: string;
      movementDate: string;
      operationId?: string;
      entryId?: string;
    },
  ): Promise<AccountMovement> => {
    const { data } = await apiClient.post('/api/client-accounts/movements', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  listStatements: async (
    orgId: string,
    clientId: string,
  ): Promise<{ statements: AccountStatement[]; total: number }> => {
    const { data } = await apiClient.get(
      `/api/client-accounts/${clientId}/statements`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  generateStatement: async (
    orgId: string,
    dto: { clientId: string; periodFrom: string; periodTo: string },
  ): Promise<AccountStatement> => {
    const { data } = await apiClient.post('/api/client-accounts/statements', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },
};
