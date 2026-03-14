export type DeliveryStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface IntegrationDelivery {
  id: string;
  organizationId: string;
  integrationId: string;
  eventType: string;
  payloadJson: string;
  status: DeliveryStatus;
  responseStatus: number | null;
  responseBody: string | null;
  attemptCount: number;
  lastAttemptAt: string | null;
  createdAt: string;
  updatedAt: string;
}
