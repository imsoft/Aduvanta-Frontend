'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { importerRegistryApi } from '../api/importer-registry.api';

export function useImporterRegistry(params?: {
  clientId?: string;
  status?: string;
  expiringDays?: number;
  limit?: number;
  offset?: number;
}) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['importer-registry', activeOrgId, params],
    queryFn: () => importerRegistryApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useImporterRegistryRecord(id: string) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['importer-registry-record', activeOrgId, id],
    queryFn: () => importerRegistryApi.getById(activeOrgId!, id),
    enabled: !!activeOrgId && !!id,
  });
}

export function useExpiringImporterRegistry(days = 30) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['importer-registry-expiring', activeOrgId, days],
    queryFn: () => importerRegistryApi.listExpiring(activeOrgId!, days),
    enabled: !!activeOrgId,
  });
}

export function useCreateImporterRegistry() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Parameters<typeof importerRegistryApi.create>[1]) =>
      importerRegistryApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importer-registry', activeOrgId] });
      toast.success('Registro creado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al crear el registro');
    },
  });
}

export function useUpdateImporterRegistry() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof importerRegistryApi.update>[2]) =>
      importerRegistryApi.update(activeOrgId!, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importer-registry', activeOrgId] });
      toast.success('Registro actualizado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al actualizar el registro');
    },
  });
}
