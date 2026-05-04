'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { customsPatentsApi } from '../api/customs-patents.api';

export function useCustomsPatents() {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['customs-patents', activeOrgId],
    queryFn: () => customsPatentsApi.list(activeOrgId!),
    enabled: !!activeOrgId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCreateCustomsPatent() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: { patentNumber: string; brokerName: string }) =>
      customsPatentsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customs-patents', activeOrgId] });
      toast.success('Patente creada');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al crear la patente');
    },
  });
}

export function useUpdateCustomsPatent(id: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Partial<{ patentNumber: string; brokerName: string }>) =>
      customsPatentsApi.update(activeOrgId!, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customs-patents', activeOrgId] });
      toast.success('Patente actualizada');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al actualizar la patente');
    },
  });
}

export function useDeleteCustomsPatent() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customsPatentsApi.remove(activeOrgId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customs-patents', activeOrgId] });
      toast.success('Patente eliminada');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al eliminar la patente');
    },
  });
}
