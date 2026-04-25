'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MagnifyingGlass, TreeStructure, MapPin } from '@phosphor-icons/react';
import { useDebounce } from '@/hooks/use-debounce';

interface TariffFraction {
  id: string;
  code: string;
  description: string;
  igiRate: string | null;
  igeRate: string | null;
  vatRate: string | null;
  iepsRate: string | null;
  unitOfMeasure: string | null;
}

interface CustomsOffice {
  id: string;
  code: string;
  name: string;
  location: string | null;
}

type Tab = 'fracciones' | 'aduanas';

export default function AdminCatalogosPage() {
  const [tab, setTab] = useState<Tab>('fracciones');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const { data: fractionsData, isLoading: loadingFractions } = useQuery({
    queryKey: ['admin-catalogs-fractions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return { fractions: [], total: 0 };
      const { data } = await apiClient.get('/api/tariff/search', {
        params: { q: debouncedSearch, limit: 50 },
      });
      return data as { fractions: TariffFraction[]; total: number };
    },
    enabled: tab === 'fracciones',
  });

  const { data: offices = [], isLoading: loadingOffices } = useQuery({
    queryKey: ['admin-catalogs-offices'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/tariff/customs-offices');
      return data as CustomsOffice[];
    },
    enabled: tab === 'aduanas',
    staleTime: 1000 * 60 * 30,
  });

  const fractions = fractionsData?.fractions ?? [];
  const filteredOffices = search
    ? offices.filter(
        (o) =>
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.code.includes(search) ||
          (o.location ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : offices;

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Catálogos SAT</h1>
          <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          TIGIE — fracciones arancelarias y aduanas del SAT
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
        {([
          { key: 'fracciones', label: 'Fracciones TIGIE', icon: TreeStructure },
          { key: 'aduanas', label: 'Aduanas', icon: MapPin },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => { setTab(key); setSearch(''); }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === key ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === 'fracciones' ? 'Buscar fracción o descripción…' : 'Buscar aduana…'}
          className="pl-8"
        />
      </div>

      {/* TIGIE fractions */}
      {tab === 'fracciones' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          {!debouncedSearch || debouncedSearch.length < 2 ? (
            <div className="px-5 py-12 text-center">
              <TreeStructure size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">Ingresa al menos 2 caracteres para buscar</p>
              <p className="text-sm text-muted-foreground mt-1">Busca por código de fracción (ej. 8471) o descripción</p>
            </div>
          ) : loadingFractions ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 px-5 flex items-center gap-3">
                  <div className="h-4 w-24 rounded bg-muted/40 animate-pulse" />
                  <div className="h-4 w-64 rounded bg-muted/30 animate-pulse" />
                </div>
              ))}
            </div>
          ) : fractions.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">Sin resultados para «{debouncedSearch}»</div>
          ) : (
            <div className="divide-y">
              {fractions.map((f) => (
                <div key={f.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20">
                  <span className="font-mono text-sm font-semibold shrink-0 w-20">{f.code}</span>
                  <p className="flex-1 text-sm text-muted-foreground truncate">{f.description}</p>
                  <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs">
                    {f.igiRate && <Badge variant="outline">IGI {f.igiRate}%</Badge>}
                    {f.vatRate && <Badge variant="outline">IVA {f.vatRate}%</Badge>}
                    {f.iepsRate && parseFloat(f.iepsRate) > 0 && <Badge variant="outline">IEPS {f.iepsRate}%</Badge>}
                    {f.unitOfMeasure && <span className="text-muted-foreground">{f.unitOfMeasure}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Customs offices */}
      {tab === 'aduanas' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/20">
            <p className="text-sm font-medium">{offices.length} aduanas registradas</p>
          </div>
          {loadingOffices ? (
            <div className="divide-y">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 px-5 flex items-center gap-3">
                  <div className="h-4 w-12 rounded bg-muted/40 animate-pulse" />
                  <div className="h-4 w-48 rounded bg-muted/30 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {filteredOffices.map((office) => (
                <div key={office.id} className="flex items-center gap-4 px-5 py-2.5 hover:bg-muted/20">
                  <span className="font-mono text-sm font-semibold shrink-0 w-12 text-primary">{office.code}</span>
                  <p className="flex-1 text-sm">{office.name}</p>
                  {office.location && (
                    <span className="text-xs text-muted-foreground shrink-0">{office.location}</span>
                  )}
                </div>
              ))}
              {filteredOffices.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">Sin resultados</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
