'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrgStore } from '@/store/org.store';
import { clientAccountsApi } from '../api/client-accounts.api';

export function useAllClientBalances() {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['client-balances', activeOrgId],
    queryFn: () => clientAccountsApi.getAllBalances(activeOrgId!),
    enabled: !!activeOrgId,
  });
}

export function useClientBalance(clientId: string) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['client-balance', activeOrgId, clientId],
    queryFn: () => clientAccountsApi.getBalance(activeOrgId!, clientId),
    enabled: !!activeOrgId && !!clientId,
  });
}

export function useClientMovements(
  clientId: string,
  params?: { limit?: number; offset?: number; dateFrom?: string; dateTo?: string },
) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['client-movements', activeOrgId, clientId, params],
    queryFn: () => clientAccountsApi.listMovements(activeOrgId!, clientId, params),
    enabled: !!activeOrgId && !!clientId,
  });
}

export function useRecordMovement() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Parameters<typeof clientAccountsApi.recordMovement>[1]) =>
      clientAccountsApi.recordMovement(activeOrgId!, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-movements', activeOrgId, data.clientId] });
      queryClient.invalidateQueries({ queryKey: ['client-balance', activeOrgId, data.clientId] });
      queryClient.invalidateQueries({ queryKey: ['client-balances', activeOrgId] });
      toast.success('Movimiento registrado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al registrar el movimiento');
    },
  });
}

export function useClientStatements(clientId: string) {
  const { activeOrgId } = useOrgStore();
  return useQuery({
    queryKey: ['client-statements', activeOrgId, clientId],
    queryFn: () => clientAccountsApi.listStatements(activeOrgId!, clientId),
    enabled: !!activeOrgId && !!clientId,
  });
}

export function useGenerateStatement() {
  const { activeOrgId } = useOrgStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: { clientId: string; periodFrom: string; periodTo: string }) =>
      clientAccountsApi.generateStatement(activeOrgId!, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-statements', activeOrgId, data.clientId] });
      toast.success('Estado de cuenta generado');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Error al generar el estado de cuenta');
    },
  });
}
