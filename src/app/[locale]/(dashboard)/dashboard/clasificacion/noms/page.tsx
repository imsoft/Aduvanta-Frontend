'use client';

import { useState } from 'react';
import { Certificate } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useNoms } from '@/features/noms/hooks/use-noms';
import type { NomApplication } from '@/features/noms/types/nom.types';

const APPLICATION_COLORS: Record<NomApplication, string> = {
  IMPORT: 'bg-blue-50 text-blue-700',
  EXPORT: 'bg-orange-50 text-orange-700',
  BOTH: 'bg-purple-50 text-purple-700',
};

const AUTHORITIES = ['SCFI', 'SSA', 'SENER', 'SEMARNAT', 'SCT', 'SE', 'SAGARPA'];
const limit = 20;

export default function NomsPage() {
  const t = useTranslations('noms');
  const [search, setSearch] = useState('');
  const [application, setApplication] = useState('ALL');
  const [authority, setAuthority] = useState('ALL');
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useNoms({
    q: search || undefined,
    application: application === 'ALL' ? undefined : application,
    limit,
    offset,
  });

  const noms = data?.noms ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const filteredNoms = authority === 'ALL' ? noms : noms.filter((n) => n.issuingAuthority === authority);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
          className="max-w-xs"
        />
        <Select value={application} onValueChange={(v) => { setApplication(v); setOffset(0); }}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allApplications')}</SelectItem>
            <SelectItem value="IMPORT">{t('applications.IMPORT')}</SelectItem>
            <SelectItem value="EXPORT">{t('applications.EXPORT')}</SelectItem>
            <SelectItem value="BOTH">{t('applications.BOTH')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={authority} onValueChange={setAuthority}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('allAuthorities')}</SelectItem>
            {AUTHORITIES.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <div className="h-64 rounded-lg border bg-muted/20 animate-pulse" />}

      {!isLoading && filteredNoms.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Certificate size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('empty')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('adjustFilters')}</p>
        </div>
      )}

      {!isLoading && filteredNoms.length > 0 && (
        <>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-52">{t('colNom')}</TableHead>
                  <TableHead>{t('colTitle')}</TableHead>
                  <TableHead>{t('colAuthority')}</TableHead>
                  <TableHead>{t('colApplication')}</TableHead>
                  <TableHead>{t('colEffective')}</TableHead>
                  <TableHead>{t('colStatus')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNoms.map((nom) => (
                  <TableRow key={nom.id}>
                    <TableCell className="font-mono text-sm font-semibold">{nom.nomKey}</TableCell>
                    <TableCell className="text-sm max-w-xs">
                      <span className="line-clamp-2">{nom.title}</span>
                      {nom.notes && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{nom.notes}</p>}
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">{nom.issuingAuthority}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${APPLICATION_COLORS[nom.application as NomApplication]}`}>
                        {t(`applications.${nom.application}`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {nom.effectiveDate ? new Date(nom.effectiveDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${nom.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {nom.status === 'ACTIVE' ? t('statusActive') : nom.status}
                      </span>
                    </TableCell>
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
