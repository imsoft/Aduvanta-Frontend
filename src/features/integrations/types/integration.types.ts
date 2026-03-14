export type IntegrationProvider = 'WEBHOOK';
export type IntegrationStatus = 'ACTIVE' | 'INACTIVE';

export type WebhookEventType =
  | 'operation.created'
  | 'operation.updated'
  | 'operation.status_changed'
  | 'document.created'
  | 'document.version_uploaded'
  | 'finance.charge_created'
  | 'finance.advance_created';

export interface Integration {
  id: string;
  organizationId: string;
  provider: IntegrationProvider;
  name: string;
  status: IntegrationStatus;
  targetUrl: string | null;
  secretEncrypted: string | null;
  eventTypes: string;
  configJson: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
