import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { complianceDocumentRequirementsApi } from '../api/compliance-document-requirements.api';
import type {
  CreateDocumentRequirementFormData,
  UpdateDocumentRequirementFormData,
} from '../schemas/document-requirement.schemas';

export function useDocumentRequirements(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['document-requirements', activeOrgId, ruleSetId],
    queryFn: () =>
      complianceDocumentRequirementsApi.listForRuleSet(activeOrgId!, ruleSetId),
    enabled: !!activeOrgId && !!ruleSetId,
  });
}

export function useCreateDocumentRequirement(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateDocumentRequirementFormData) =>
      complianceDocumentRequirementsApi.create(activeOrgId!, ruleSetId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['document-requirements', activeOrgId, ruleSetId],
      });
      toast.success('Document requirement added');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to add document requirement');
    },
  });
}

export function useUpdateDocumentRequirement(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requirementId,
      dto,
    }: {
      requirementId: string;
      dto: UpdateDocumentRequirementFormData;
    }) => complianceDocumentRequirementsApi.update(activeOrgId!, requirementId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['document-requirements', activeOrgId, ruleSetId],
      });
      toast.success('Requirement updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to update requirement');
    },
  });
}

export function useDeleteDocumentRequirement(ruleSetId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requirementId: string) =>
      complianceDocumentRequirementsApi.delete(activeOrgId!, requirementId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['document-requirements', activeOrgId, ruleSetId],
      });
      toast.success('Document requirement removed');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to remove document requirement');
    },
  });
}
