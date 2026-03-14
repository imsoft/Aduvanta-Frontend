export type ImportType = 'CLIENTS';
export type ImportJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ImportResultSummary {
  processed: number;
  created: number;
  failed: number;
  errors: string[];
}

export interface ImportJob {
  id: string;
  organizationId: string;
  type: ImportType;
  status: ImportJobStatus;
  fileName: string | null;
  storageKey: string | null;
  requestedById: string;
  resultSummaryJson: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
