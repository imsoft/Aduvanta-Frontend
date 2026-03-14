import { apiClient } from '@/lib/api-client';
import type { StatusTransitionRule } from '../types/status-rule.types';
import type {
  CreateStatusRuleFormData,
  UpdateStatusRuleFormData,
} from '../schemas/status-rule.schemas';

export const complianceStatusRulesApi = {
  listForRuleSet: async (
    orgId: string,
    ruleSetId: string,
  ): Promise<StatusTransitionRule[]> => {
    const { data } = await apiClient.get<StatusTransitionRule[]>(
      `/api/compliance/rule-sets/${ruleSetId}/status-rules`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    ruleSetId: string,
    dto: CreateStatusRuleFormData,
  ): Promise<StatusTransitionRule> => {
    const { data } = await apiClient.post<StatusTransitionRule>(
      `/api/compliance/rule-sets/${ruleSetId}/status-rules`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    statusRuleId: string,
    dto: UpdateStatusRuleFormData,
  ): Promise<StatusTransitionRule> => {
    const { data } = await apiClient.patch<StatusTransitionRule>(
      `/api/compliance/status-rules/${statusRuleId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  delete: async (orgId: string, statusRuleId: string): Promise<void> => {
    await apiClient.delete(`/api/compliance/status-rules/${statusRuleId}`, {
      headers: { 'x-organization-id': orgId },
    });
  },
};
