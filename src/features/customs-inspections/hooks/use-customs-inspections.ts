'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { customsInspectionsApi } from '../api/customs-inspections.api';

export function useCustomsInspections(params?: {
  operationId?: string;
  entryId?: string;
  result?: string;
  semaphoreColor?: string;
  limit?: number;
  offset?: number;
}) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['customs-inspections', activeOrgId, params],
    queryFn: () => customsInspectionsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useCustomsInspection(id: string) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['customs-inspection', activeOrgId, id],
    queryFn: () => customsInspectionsApi.getById(activeOrgId!, id),
    enabled: !!activeOrgId && !!id,
  });
}

export function useCreateCustomsInspection() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Parameters<typeof customsInspectionsApi.create>[1]) =>
      customsInspectionsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customs-inspections', activeOrgId] });
      toast.success('Inspección registrada correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al registrar la inspección');
    },
  });
}

export function useRecordSemaphore() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...dto
    }: { id: string } & Parameters<typeof customsInspectionsApi.recordSemaphore>[2]) =>
      customsInspectionsApi.recordSemaphore(activeOrgId!, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customs-inspections', activeOrgId] });
      toast.success('Resultado de semáforo registrado');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al registrar el semáforo');
    },
  });
}
