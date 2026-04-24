'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import {
  customsEntriesApi,
  type ListEntriesParams,
} from '../api/customs-entries.api';

export function useCustomsOffices() {
  return useQuery({
    queryKey: ['customs-offices'],
    queryFn: () => customsEntriesApi.listOffices(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCustomsPatents() {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['customs-patents', activeOrgId],
    queryFn: () => customsEntriesApi.listPatents(activeOrgId!),
    enabled: !!activeOrgId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCustomsEntries(params?: ListEntriesParams) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['customs-entries', activeOrgId, params],
    queryFn: () => customsEntriesApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useCustomsEntry(entryId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['customs-entries', activeOrgId, entryId],
    queryFn: () => customsEntriesApi.getById(activeOrgId!, entryId),
    enabled: !!activeOrgId && !!entryId,
  });
}

export function useCreateCustomsEntry() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      dto: Parameters<typeof customsEntriesApi.create>[1],
    ) => customsEntriesApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customs-entries', activeOrgId],
      });
      toast.success('Pedimento creado correctamente');
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ?? 'Error al crear el pedimento',
      );
    },
  });
}

export function useUpdateCustomsEntry(entryId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Parameters<typeof customsEntriesApi.update>[2]) =>
      customsEntriesApi.update(activeOrgId!, entryId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customs-entries', activeOrgId],
      });
      toast.success('Pedimento actualizado');
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ?? 'Error al actualizar el pedimento',
      );
    },
  });
}

export function useChangeEntryStatus(entryId: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      status,
      comment,
    }: {
      status: string;
      comment?: string;
    }) => customsEntriesApi.changeStatus(activeOrgId!, entryId, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customs-entries', activeOrgId],
      });
      toast.success('Estado del pedimento actualizado');
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ?? 'Error al cambiar el estado',
      );
    },
  });
}

export function useGenerateSaaiLayout(entryId: string) {
  const { activeOrgId } = useOrgStore();

  return useMutation({
    mutationFn: () => customsEntriesApi.generateSaaiLayout(activeOrgId!, entryId),
    onSuccess: () => {
      toast.success('Layout SAAI generado y descargado');
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ?? 'Error al generar el layout SAAI',
      );
    },
  });
}

export function useValidateSaai(entryId: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['saai-validation', activeOrgId, entryId],
    queryFn: () => customsEntriesApi.validateSaai(activeOrgId!, entryId),
    enabled: !!activeOrgId && !!entryId,
  });
}
