export type OperationAdvanceStatus = 'ACTIVE' | 'INACTIVE';

export interface OperationAdvance {
  id: string;
  organizationId: string;
  operationId: string;
  amount: string;
  currency: string;
  reference: string | null;
  notes: string | null;
  receivedAt: string;
  status: OperationAdvanceStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
