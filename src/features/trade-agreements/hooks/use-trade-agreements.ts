'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import {
  tradeAgreementsApi,
  type ListTradeAgreementsParams,
} from '../api/trade-agreements.api';

export function useTradeAgreements(params?: ListTradeAgreementsParams) {
  return useQuery({
    queryKey: ['trade-agreements', params],
    queryFn: () => tradeAgreementsApi.list(params),
    staleTime: 1000 * 60 * 60,
  });
}

export function useTradeAgreement(id: string) {
  return useQuery({
    queryKey: ['trade-agreements', id],
    queryFn: () => tradeAgreementsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}

export function useTradeAgreementPreferences(id: string) {
  return useQuery({
    queryKey: ['trade-agreement-preferences', id],
    queryFn: () => tradeAgreementsApi.listPreferences(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}

export function usePreferencesByFraction(fractionId: string) {
  return useQuery({
    queryKey: ['trade-agreement-preferences-by-fraction', fractionId],
    queryFn: () => tradeAgreementsApi.listPreferencesByFraction(fractionId),
    enabled: !!fractionId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useCreateTradeAgreement() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Parameters<typeof tradeAgreementsApi.create>[1]) =>
      tradeAgreementsApi.create(activeOrgId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-agreements'] });
      toast.success('Tratado creado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al crear el tratado');
    },
  });
}

export function useUpdateTradeAgreement(id: string) {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Parameters<typeof tradeAgreementsApi.update>[2]) =>
      tradeAgreementsApi.update(activeOrgId!, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-agreements'] });
      toast.success('Tratado actualizado');
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ?? 'Error al actualizar el tratado',
      );
    },
  });
}
