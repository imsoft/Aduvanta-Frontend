export type OperationStatus = 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface StatusTransitionRule {
  id: string;
  organizationId: string;
  ruleSetId: string;
  fromStatus: OperationStatus;
  toStatus: OperationStatus;
  requiresAllRequiredDocuments: boolean;
  createdAt: string;
  updatedAt: string;
}
