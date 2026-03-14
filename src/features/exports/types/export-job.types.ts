export type ExportType = 'CLIENTS' | 'OPERATIONS' | 'FINANCE';
export type ExportJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ExportJob {
  id: string;
  organizationId: string;
  type: ExportType;
  status: ExportJobStatus;
  fileName: string | null;
  storageKey: string | null;
  requestedById: string;
  filtersJson: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
