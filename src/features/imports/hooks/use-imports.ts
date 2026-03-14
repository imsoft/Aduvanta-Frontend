import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { importsApi } from '../api/imports.api';

export function useImports(params?: { status?: string }) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['imports', activeOrgId, params],
    queryFn: () => importsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useCreateImport() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, file }: { type: 'CLIENTS'; file: File }) =>
      importsApi.create(activeOrgId!, type, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imports', activeOrgId] });
      toast.success('Import completed');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to run import');
    },
  });
}
