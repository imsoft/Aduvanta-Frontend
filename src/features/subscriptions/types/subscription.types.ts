export type PlanStatus = 'ACTIVE' | 'DEPRECATED';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface Plan {
  id: string;
  code: string;
  name: string;
  status: PlanStatus;
  maxUsers: number;
  maxClients: number;
  maxOperations: number;
  maxStorageBytes: number;
  maxIntegrations: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  startedAt: string;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionWithPlan {
  subscription: Subscription;
  plan: Plan;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}
