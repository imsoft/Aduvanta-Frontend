'use client';

import { useQuery } from '@tanstack/react-query';
import { nomsApi, type ListNomsParams } from '../api/noms.api';

export function useNoms(params?: ListNomsParams) {
  return useQuery({
    queryKey: ['noms', params],
    queryFn: () => nomsApi.list(params),
    staleTime: 1000 * 60 * 60,
  });
}

export function useNomsByFraction(fractionId: string) {
  return useQuery({
    queryKey: ['noms-by-fraction', fractionId],
    queryFn: () => nomsApi.getByFraction(fractionId),
    enabled: !!fractionId,
    staleTime: 1000 * 60 * 60,
  });
}
