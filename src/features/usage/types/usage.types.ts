export interface UsageMetrics {
  users: number;
  clients: number;
  operations: number;
  integrations: number;
}

export interface UsageLimits {
  maxUsers: number;
  maxClients: number;
  maxOperations: number;
  maxIntegrations: number;
}

export interface OrganizationUsage {
  metrics: UsageMetrics;
  limits: UsageLimits | null;
  planCode: string | null;
  planName: string | null;
}
