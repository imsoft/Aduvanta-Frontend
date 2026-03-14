import { apiClient } from '@/lib/api-client';
import type { RuleSet } from '../types/rule-set.types';
import type { CreateRuleSetFormData, UpdateRuleSetFormData } from '../schemas/rule-set.schemas';

export interface ListRuleSetsParams {
  operationType?: 'IMPORT' | 'EXPORT' | 'INTERNAL';
  isActive?: boolean;
}

export const complianceRuleSetsApi = {
  list: async (orgId: string, params?: ListRuleSetsParams): Promise<RuleSet[]> => {
    const { data } = await apiClient.get<RuleSet[]>('/api/compliance/rule-sets', {
      params,
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  create: async (orgId: string, dto: CreateRuleSetFormData): Promise<RuleSet> => {
    const { data } = await apiClient.post<RuleSet>('/api/compliance/rule-sets', dto, {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getById: async (orgId: string, ruleSetId: string): Promise<RuleSet> => {
    const { data } = await apiClient.get<RuleSet>(
      `/api/compliance/rule-sets/${ruleSetId}`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    ruleSetId: string,
    dto: UpdateRuleSetFormData,
  ): Promise<RuleSet> => {
    const { data } = await apiClient.patch<RuleSet>(
      `/api/compliance/rule-sets/${ruleSetId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  delete: async (orgId: string, ruleSetId: string): Promise<void> => {
    await apiClient.delete(`/api/compliance/rule-sets/${ruleSetId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
