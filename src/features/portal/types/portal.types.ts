// Portal-facing views reuse the same shapes as the internal types.
// Re-exported here for clarity in portal-specific code.
export type { Operation, OperationStatusHistory } from '@/features/operations/types/operation.types';
export type { Document } from '@/features/documents/types/document.types';

export interface PortalComment {
  id: string;
  organizationId: string;
  operationId: string;
  authorId: string;
  body: string;
  isClientVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
