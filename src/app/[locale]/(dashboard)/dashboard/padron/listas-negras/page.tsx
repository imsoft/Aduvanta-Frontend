'use client';

import { useState } from 'react';
import { ShieldWarning, CheckCircle, MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSatBlacklists, useCheckTaxpayer } from '@/features/sat-blacklists/hooks/use-sat-blacklists';
import type { SatBlacklistType } from '@/features/sat-blacklists/types/sat-blacklist.types';

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

const LIST_TYPES: SatBlacklistType[] = [
  'ARTICLE_69B','DEFINITIVE_69B','FAVORABLE_69B','PRESUMED_EDOS',
  'DEFINITIVE_EDOS','ARTICLE_69','CANCELED_SEAL','RESTRICTED_SEAL',
];

const limit = 20;

function CheckTab({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [rfcInput, setRfcInput] = useState('');
  const [taxId, setTaxId] = useState('');
  const { data, isLoading, isFetched } = useCheckTaxpayer(taxId);

  const handleCheck = () => {
    const clean = rfcInput.trim().toUpperCase();
    if (clean.length >= 10) setTaxId(clean);
  };

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex gap-2">
        <Input
          placeholder={t('rfcPlaceholder')}
          value={rfcInput}
          onChange={(e) => setRfcInput(e.target.value.toUpperCase())}
          maxLength={13}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
        <Button onClick={handleCheck} disabled={rfcInput.trim().length < 10}>
          <MagnifyingGlass size={16} />
          {t('checkButton')}
        </Button>
      </div>

      {isLoading && taxId && <div className="h-20 rounded-lg border bg-muted/20 animate-pulse" />}

      {isFetched && data && !data.found && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle size={20} className="text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">{t('cleanTitle')}</p>
            <p className="text-xs text-green-700">{t('cleanDescription')}</p>
          </div>
        </div>
      )}

      {isFetched && data && data.found && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <ShieldWarning size={20} className="text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">{t('foundTitle')}</p>
              <p className="text-xs text-red-700">{data.taxId} — {data.entries.length} registro(s)</p>
            </div>
          </div>
          <div className="space-y-2">
            {data.entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border p-3 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${LIST_TYPE_COLORS[entry.listType]}`}>
                    {t(`listTypes.${entry.listType}`)}
                  </span>
                  {entry.publicationDate && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.publicationDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {entry.taxpayerName && <p className="text-muted-foreground">{entry.taxpayerName}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ListadosTab({ t }: { t: ReturnType<typeof useTranslations> }) {
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
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
          className="max-w-xs"
        />
        <Select value={listType} onValueChange={(v) => { setListType(v); setOffset(0); }}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allLists')}</SelectItem>
            {LIST_TYPES.map((lt) => (
              <SelectItem key={lt} value={lt}>{t(`listTypes.${lt}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />}

      {!isLoading && entries.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">{t('noRecords')}</p>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('colRfc')}</TableHead>
                  <TableHead>{t('colName')}</TableHead>
                  <TableHead>{t('colList')}</TableHead>
                  <TableHead>{t('colPublication')}</TableHead>
                  <TableHead>{t('colNotes')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-sm font-medium">{e.taxId}</TableCell>
                    <TableCell className="text-sm">{e.taxpayerName ?? '—'}</TableCell>
                    <TableCell>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${LIST_TYPE_COLORS[e.listType]}`}>
                        {t(`listTypes.${e.listType}`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {e.publicationDate ? new Date(e.publicationDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{e.notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t('showing', { from: offset + 1, to: Math.min(offset + limit, total), total })}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
                {t('prev')}
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setOffset(offset + limit)}>
                {t('next')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ListasNegrasPage() {
  const t = useTranslations('satBlacklists');
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
      </div>
      <Tabs defaultValue="check">
        <TabsList>
          <TabsTrigger value="check">{t('checkTab')}</TabsTrigger>
          <TabsTrigger value="list">{t('listTab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="check" className="mt-4"><CheckTab t={t} /></TabsContent>
        <TabsContent value="list" className="mt-4"><ListadosTab t={t} /></TabsContent>
      </Tabs>
    </div>
  );
}
