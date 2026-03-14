import { apiClient } from '@/lib/api-client';
import type { DocumentRequirement } from '../types/document-requirement.types';
import type {
  CreateDocumentRequirementFormData,
  UpdateDocumentRequirementFormData,
} from '../schemas/document-requirement.schemas';

export const complianceDocumentRequirementsApi = {
  listForRuleSet: async (
    orgId: string,
    ruleSetId: string,
  ): Promise<DocumentRequirement[]> => {
    const { data } = await apiClient.get<DocumentRequirement[]>(
      `/api/compliance/rule-sets/${ruleSetId}/document-requirements`,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  create: async (
    orgId: string,
    ruleSetId: string,
    dto: CreateDocumentRequirementFormData,
  ): Promise<DocumentRequirement> => {
    const { data } = await apiClient.post<DocumentRequirement>(
      `/api/compliance/rule-sets/${ruleSetId}/document-requirements`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  update: async (
    orgId: string,
    requirementId: string,
    dto: UpdateDocumentRequirementFormData,
  ): Promise<DocumentRequirement> => {
    const { data } = await apiClient.patch<DocumentRequirement>(
      `/api/compliance/document-requirements/${requirementId}`,
      dto,
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },

  delete: async (orgId: string, requirementId: string): Promise<void> => {
    await apiClient.delete(
      `/api/compliance/document-requirements/${requirementId}`,
      { headers: { 'x-organization-id': orgId } },
    );
  },
};
