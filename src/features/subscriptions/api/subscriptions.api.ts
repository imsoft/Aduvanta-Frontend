import { apiClient } from '@/lib/api-client';
import type { Plan, SubscriptionWithPlan, PaymentMethod } from '../types/subscription.types';

export const subscriptionsApi = {
  listPlans: async (orgId: string): Promise<Plan[]> => {
    const { data } = await apiClient.get<Plan[]>('/api/plans', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getMySubscription: async (orgId: string): Promise<SubscriptionWithPlan | null> => {
    const { data } = await apiClient.get<SubscriptionWithPlan | null>(
      '/api/subscriptions/my',
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  getPaymentMethods: async (orgId: string): Promise<PaymentMethod[]> => {
    const { data } = await apiClient.get<PaymentMethod[]>(
      '/api/subscriptions/payment-methods',
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  createPortalSession: async (orgId: string): Promise<{ url: string }> => {
    const { data } = await apiClient.post<{ url: string }>(
      '/api/subscriptions/portal',
      {},
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  assignPlan: async (
    orgId: string,
    planId: string,
  ): Promise<SubscriptionWithPlan> => {
    const { data } = await apiClient.post<SubscriptionWithPlan>(
      '/api/subscriptions',
      { planId },
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
