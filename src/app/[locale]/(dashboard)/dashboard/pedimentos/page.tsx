'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Plus, FileText } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CustomsEntriesTable } from '@/components/customs-entries/customs-entries-table';
import { useOrgStore } from '@/store/org.store';
import { useCustomsEntries } from '@/features/customs-entries/hooks/use-customs-entries';

const STATUS_VALUES = ['ALL','DRAFT','PREVALIDATED','VALIDATED','PAID','DISPATCHED','RELEASED','CANCELLED','RECTIFIED'] as const;
const REGIME_VALUES = ['ALL','IMP_DEFINITIVA','EXP_DEFINITIVA','IMP_TEMPORAL','EXP_TEMPORAL','DEPOSITO_FISCAL','VIRTUAL'] as const;

export default function PedimentosPage() {
  const t = useTranslations('customsEntries');
  const { activeOrgId } = useOrgStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [regime, setRegime] = useState('ALL');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = useCustomsEntries({
    q: search || undefined,
    status: status === 'ALL' ? undefined : status,
    regime: regime === 'ALL' ? undefined : regime,
    limit,
    offset,
  });

  const entries = data?.entries ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  if (!activeOrgId) {
    return <div className="w-full text-sm text-muted-foreground">{t('selectOrg')}</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('pageTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('pageDescription')}</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/pedimentos/nuevo">
            <Plus size={14} />
            {t('new')}
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
          className="w-full min-w-0 max-w-xs"
        />
        <Select value={status} onValueChange={(v) => { setStatus(v); setOffset(0); }}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_VALUES.map((s) => (
              <SelectItem key={s} value={s}>{t(`statuses.${s}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={regime} onValueChange={(v) => { setRegime(v); setOffset(0); }}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            {REGIME_VALUES.map((r) => (
              <SelectItem key={r} value={r}>{t(`regimes.${r}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />}

      {!isLoading && entries.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FileText size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('empty')}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || status !== 'ALL' || regime !== 'ALL' ? t('adjustFilters') : t('emptyHint')}
          </p>
          {!search && status === 'ALL' && regime === 'ALL' && (
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/pedimentos/nuevo">{t('new')}</Link>
            </Button>
          )}
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          <CustomsEntriesTable entries={entries} />
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
