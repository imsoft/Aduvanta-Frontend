'use client';

import { useState } from 'react';
import {
  ShieldWarning,
  CheckCircle,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSatBlacklists, useCheckTaxpayer } from '@/features/sat-blacklists/hooks/use-sat-blacklists';
import type { SatBlacklistType } from '@/features/sat-blacklists/types/sat-blacklist.types';

const LIST_TYPE_LABELS: Record<SatBlacklistType, string> = {
  ARTICLE_69B: 'Art. 69-B (EFOS presuntos)',
  DEFINITIVE_69B: 'Art. 69-B (EFOS definitivos)',
  FAVORABLE_69B: 'Art. 69-B (resolución favorable)',
  PRESUMED_EDOS: 'EDOS presuntos',
  DEFINITIVE_EDOS: 'EDOS definitivos',
  ARTICLE_69: 'Art. 69 CFF',
  CANCELED_SEAL: 'Sello cancelado',
  RESTRICTED_SEAL: 'Sello restringido',
};

const LIST_TYPE_COLORS: Record<SatBlacklistType, string> = {
  ARTICLE_69B: 'bg-orange-50 text-orange-700',
  DEFINITIVE_69B: 'bg-red-50 text-red-700',
  FAVORABLE_69B: 'bg-green-50 text-green-700',
  PRESUMED_EDOS: 'bg-orange-50 text-orange-700',
  DEFINITIVE_EDOS: 'bg-red-50 text-red-700',
  ARTICLE_69: 'bg-yellow-50 text-yellow-700',
  CANCELED_SEAL: 'bg-gray-100 text-gray-600',
  RESTRICTED_SEAL: 'bg-gray-100 text-gray-600',
};

const limit = 20;

function CheckTab() {
  const [rfcInput, setRfcInput] = useState('');
  const [taxId, setTaxId] = useState('');

  const { data, isLoading, isFetched } = useCheckTaxpayer(taxId);

  const handleCheck = () => {
    const clean = rfcInput.trim().toUpperCase();
    if (clean.length >= 10) {
      setTaxId(clean);
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex gap-2">
        <Input
          placeholder="RFC del contribuyente (12-13 caracteres)"
          value={rfcInput}
          onChange={(e) => setRfcInput(e.target.value.toUpperCase())}
          maxLength={13}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
        <Button onClick={handleCheck} disabled={rfcInput.trim().length < 10}>
          <MagnifyingGlass size={16} />
          Consultar
        </Button>
      </div>

      {isLoading && taxId && (
        <div className="h-20 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {isFetched && data && !data.found && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle size={20} className="text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">RFC limpio</p>
            <p className="text-xs text-green-700">
              Sin registros en listas SAT para {data.taxId}
            </p>
          </div>
        </div>
      )}

      {isFetched && data && data.found && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <ShieldWarning size={20} className="text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                RFC encontrado en listas SAT
              </p>
              <p className="text-xs text-red-700">
                {data.taxId} — {data.entries.length} registro(s)
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {data.entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border p-3 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${LIST_TYPE_COLORS[entry.listType]}`}
                  >
                    {LIST_TYPE_LABELS[entry.listType]}
                  </span>
                  {entry.publicationDate && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.publicationDate).toLocaleDateString('es-MX')}
                    </span>
                  )}
                </div>
                {entry.taxpayerName && (
                  <p className="text-muted-foreground">{entry.taxpayerName}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ListadosTab() {
  const [search, setSearch] = useState('');
  const [listType, setListType] = useState('ALL');
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useSatBlacklists({
    q: search || undefined,
    listType: listType === 'ALL' ? undefined : listType,
    limit,
    offset,
  });

  const entries = data?.entries ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por RFC o nombre..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          className="max-w-xs"
        />
        <Select
          value={listType}
          onValueChange={(v) => {
            setListType(v);
            setOffset(0);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las listas</SelectItem>
            {Object.entries(LIST_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && entries.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No se encontraron registros
          </p>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFC</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Lista</TableHead>
                  <TableHead>Publicación</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-sm font-medium">
                      {e.taxId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {e.taxpayerName ?? '—'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${LIST_TYPE_COLORS[e.listType]}`}
                      >
                        {LIST_TYPE_LABELS[e.listType]}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {e.publicationDate
                        ? new Date(e.publicationDate).toLocaleDateString('es-MX')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {e.notes ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {offset + 1}–{Math.min(offset + limit, total)} de {total} registros
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setOffset(offset + limit)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ListasNegrasPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Listas Negras SAT
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consulta contribuyentes en listas del SAT — Art. 69, 69-B CFF, EFOS y EDOS
        </p>
      </div>

      <Tabs defaultValue="check">
        <TabsList>
          <TabsTrigger value="check">Consulta RFC</TabsTrigger>
          <TabsTrigger value="list">Listados</TabsTrigger>
        </TabsList>
        <TabsContent value="check" className="mt-4">
          <CheckTab />
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <ListadosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
