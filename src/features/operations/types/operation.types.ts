export type OperationStatus = 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type OperationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type OperationType = 'IMPORT' | 'EXPORT' | 'INTERNAL';

export interface Operation {
  id: string;
  organizationId: string;
  clientId: string;
  reference: string;
  title: string;
  description: string | null;
  type: OperationType;
  status: OperationStatus;
  priority: OperationPriority;
  assignedUserId: string | null;
  createdById: string;
  openedAt: string | null;
  dueAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationStatusHistory {
  id: string;
  organizationId: string;
  operationId: string;
  fromStatus: OperationStatus | null;
  toStatus: OperationStatus;
  changedById: string;
  comment: string | null;
  createdAt: string;
}
