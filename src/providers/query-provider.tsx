'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cinco minutos: lo suficiente para que moverse entre páginas
            // del dashboard no dispare un refetch por cada tabla/listado.
            // Las mutaciones invalidan manualmente las keys que tocan.
            staleTime: 5 * 60 * 1000,
            // Mantener la caché en memoria 30 min tras desmontar para que
            // volver a una página ya visitada sea instantáneo.
            gcTime: 30 * 60 * 1000,
            // No refetcheamos cuando el usuario cambia de pestaña y vuelve:
            // ruidoso y lento, y rara vez aporta frescura que no se
            // consiga con la invalidación explícita post-mutación.
            refetchOnWindowFocus: false,
            // Tampoco en cada reconexión del socket — Next y tanstack-query
            // dev reconectan constantemente en HMR.
            refetchOnReconnect: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
