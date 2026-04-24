import { useQuery } from '@tanstack/react-query';
import { exchangeRatesApi } from '../api/exchange-rates.api';

export function useMarketRates(base = 'MXN') {
  return useQuery({
    queryKey: ['exchange-rates', 'market', base],
    queryFn: () => exchangeRatesApi.getMarketRates(base),
    staleTime: 1000 * 60 * 30, // 30 min — backend caches 6h anyway
    retry: 1,
  });
}

export function useFixRate() {
  return useQuery({
    queryKey: ['exchange-rates', 'fix'],
    queryFn: () => exchangeRatesApi.getFixRate(),
    staleTime: 1000 * 60 * 60 * 4, // 4h — FIX updates once per business day
    retry: 1,
  });
}
