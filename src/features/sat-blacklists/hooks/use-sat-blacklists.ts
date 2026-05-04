'use client';

import { useQuery } from '@tanstack/react-query';
import { satBlacklistsApi, type ListBlacklistParams } from '../api/sat-blacklists.api';

export function useSatBlacklists(params?: ListBlacklistParams) {
  return useQuery({
    queryKey: ['sat-blacklists', params],
    queryFn: () => satBlacklistsApi.list(params),
    staleTime: 1000 * 60 * 30,
  });
}

export function useCheckTaxpayer(taxId: string) {
  return useQuery({
    queryKey: ['sat-blacklist-check', taxId],
    queryFn: () => satBlacklistsApi.check(taxId),
    enabled: taxId.length >= 10,
    staleTime: 1000 * 60 * 5,
  });
}
