export type DocumentStatus = 'ACTIVE' | 'INACTIVE';

export interface Document {
  id: string;
  organizationId: string;
  operationId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  storageKey: string;
  mimeType: string;
  sizeInBytes: number;
  uploadedById: string;
  status: DocumentStatus;
  currentVersionNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  organizationId: string;
  documentId: string;
  versionNumber: number;
  storageKey: string;
  mimeType: string;
  sizeInBytes: number;
  uploadedById: string;
  createdAt: string;
}
