import { apiClient } from '@/lib/api-client';
import type { Plan, SubscriptionWithPlan } from '../types/subscription.types';

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
