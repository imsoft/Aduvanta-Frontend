import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { documentsApi, type ListDocumentsParams } from '../api/documents.api';
import type { UpdateDocumentFormData } from '../schemas/document.schemas';

export function useOperationDocuments(operationId: string, params?: ListDocumentsParams) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['documents', activeOrgId, operationId, params],
    queryFn: () => documentsApi.listForOperation(activeOrgId!, operationId, params),
    enabled: !!activeOrgId && !!operationId,
  });
}

export function useDocumentVersions(documentId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['document-versions', activeOrgId, documentId],
    queryFn: () => documentsApi.getVersions(activeOrgId!, documentId),
    enabled: !!activeOrgId && !!documentId,
  });
}

export function useUploadDocument(operationId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      meta,
    }: {
      file: File;
      meta: { name?: string; description?: string; categoryId?: string };
    }) => documentsApi.upload(activeOrgId!, operationId, file, meta),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      });
      toast.success('Document uploaded');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to upload document');
    },
  });
}

export function useUpdateDocument(documentId: string, operationId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateDocumentFormData) =>
      documentsApi.update(activeOrgId!, documentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      });
      toast.success('Document updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to update document');
    },
  });
}

export function useDeactivateDocument(operationId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      documentsApi.deactivate(activeOrgId!, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      });
      toast.success('Document deactivated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to deactivate document');
    },
  });
}

export function useUploadDocumentVersion(documentId: string, operationId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      documentsApi.uploadVersion(activeOrgId!, documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', activeOrgId, operationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['document-versions', activeOrgId, documentId],
      });
      toast.success('New version uploaded');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to upload version');
    },
  });
}

export function useDocumentDownloadUrl() {
  const { activeOrgId } = useOrgStore();

  return useMutation({
    mutationFn: (documentId: string) =>
      documentsApi.getDownloadUrl(activeOrgId!, documentId),
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to get download URL');
    },
  });
}
