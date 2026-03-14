export type OperationChargeStatus = 'ACTIVE' | 'INACTIVE';

export interface OperationCharge {
  id: string;
  organizationId: string;
  operationId: string;
  type: string;
  description: string | null;
  amount: string;
  currency: string;
  status: OperationChargeStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
