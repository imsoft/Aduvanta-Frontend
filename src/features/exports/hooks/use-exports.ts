import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { exportsApi } from '../api/exports.api';
import type { CreateExportJobFormData } from '../schemas/export-job.schemas';

export function useExports(params?: { status?: string; type?: string }) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['exports', activeOrgId, params],
    queryFn: () => exportsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useCreateExport() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateExportJobFormData) => exportsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exports', activeOrgId] });
      toast.success('Export started');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to start export');
    },
  });
}

export function useExportDownloadUrl(exportJobId: string) {
  const { activeOrgId } = useOrgStore();

  return useMutation({
    mutationFn: () => exportsApi.getDownloadUrl(activeOrgId!, exportJobId),
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to get download link');
    },
  });
}
