export type OperationType = 'IMPORT' | 'EXPORT' | 'INTERNAL';

export interface RuleSet {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  operationType: OperationType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
