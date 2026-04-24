'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { immexProgramsApi } from '../api/immex-programs.api';

export function useImmexPrograms(params?: {
  clientId?: string;
  status?: string;
  programType?: string;
  limit?: number;
  offset?: number;
}) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['immex-programs', activeOrgId, params],
    queryFn: () => immexProgramsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useImmexProgram(id: string) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['immex-program', activeOrgId, id],
    queryFn: () => immexProgramsApi.getById(activeOrgId!, id),
    enabled: !!activeOrgId && !!id,
  });
}

export function useExpiringImmexPrograms(days = 30) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['immex-programs-expiring', activeOrgId, days],
    queryFn: () => immexProgramsApi.listExpiring(activeOrgId!, days),
    enabled: !!activeOrgId,
  });
}

export function useImmexProgramProducts(id: string) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['immex-program-products', activeOrgId, id],
    queryFn: () => immexProgramsApi.getProducts(activeOrgId!, id),
    enabled: !!activeOrgId && !!id,
  });
}

export function useCreateImmexProgram() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Parameters<typeof immexProgramsApi.create>[1]) =>
      immexProgramsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['immex-programs', activeOrgId] });
      toast.success('Programa IMMEX creado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al crear el programa IMMEX');
    },
  });
}

export function useUpdateImmexProgram() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof immexProgramsApi.update>[2]) =>
      immexProgramsApi.update(activeOrgId!, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['immex-programs', activeOrgId] });
      toast.success('Programa IMMEX actualizado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al actualizar el programa IMMEX');
    },
  });
}
