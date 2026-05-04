'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { shipmentsApi, type ListShipmentsParams } from '../api/shipments.api';

export function useShipments(params?: ListShipmentsParams) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['shipments', activeOrgId, params],
    queryFn: () => shipmentsApi.list(activeOrgId!, params),
    enabled: !!activeOrgId,
  });
}

export function useShipment(id: string) {
  const { activeOrgId } = useOrgStore();

  return useQuery({
    queryKey: ['shipments', activeOrgId, id],
    queryFn: () => shipmentsApi.getById(activeOrgId!, id),
    enabled: !!activeOrgId && !!id,
  });
}

export function useCreateShipment() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Parameters<typeof shipmentsApi.create>[1]) =>
      shipmentsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments', activeOrgId] });
      toast.success('Embarque creado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al crear el embarque');
    },
  });
}

export function useChangeShipmentStatus(id: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, reason }: { status: string; reason?: string }) =>
      shipmentsApi.changeStatus(activeOrgId!, id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments', activeOrgId] });
      toast.success('Estado del embarque actualizado');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al cambiar el estado');
    },
  });
}
