'use client';

import { useState, useCallback } from 'react';
import { MagnifyingGlass, Info, ArrowRight, Certificate } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { tariffApi } from '@/features/customs-entries/api/tariff.api';
import { useDebounce } from '@/hooks/use-debounce';

function TariffRateBadge({ rate }: { rate: string | null }) {
  if (!rate) return <span className="text-muted-foreground">—</span>;
  const num = parseFloat(rate);
  const color =
    num === 0
      ? 'text-green-700 bg-green-50'
      : num <= 5
        ? 'text-yellow-700 bg-yellow-50'
        : 'text-red-700 bg-red-50';
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-mono font-medium ${color}`}>
      {num}%
    </span>
  );
}

export default function ClasificacionPage() {
  const t = useTranslations('classification');
  const [query, setQuery] = useState('');
  const [selected, setSelected] =
    useState<Awaited<ReturnType<typeof tariffApi.getByFraction>> | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['tariff-search', debouncedQuery],
    queryFn: () => tariffApi.search(debouncedQuery, 30),
    enabled: debouncedQuery.length >= 2,
  });

  const fractions = data?.fractions ?? [];
  const total = data?.total ?? 0;

  const handleSelect = useCallback(
    async (fraction: string) => {
      const detail = await tariffApi.getByFraction(fraction);
      setSelected(detail);
    },
    [],
  );

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('pageTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('pageDescription')}</p>
      </div>

      <div className="relative max-w-2xl">
        <MagnifyingGlass
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          className="pl-9"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.length < 2 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <MagnifyingGlass
            size={32}
            className="mx-auto mb-3 text-muted-foreground"
          />
          <p className="text-sm font-medium">{t('searchHintTitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('searchHint')}</p>
        </div>
      )}

      {query.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-3">
            {isLoading && (
              <div className="h-40 bg-muted/20 rounded-lg animate-pulse" />
            )}

            {!isLoading && fractions.length === 0 && (
              <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                {t('noResults', { query })}
              </div>
            )}

            {!isLoading && fractions.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground">
                  {total === 1 ? t('results', { total }) : t('resultsPlural', { total })}
                </p>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-28">{t('columnFraction')}</TableHead>
                        <TableHead>{t('columnDescription')}</TableHead>
                        <TableHead className="w-20">{t('columnIGI')}</TableHead>
                        <TableHead className="w-20">{t('columnIVA')}</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fractions.map((f) => (
                        <TableRow
                          key={f.id}
                          className={`cursor-pointer ${selected?.fraction === f.fraction ? 'bg-muted/50' : ''}`}
                          onClick={() => handleSelect(f.fraction)}
                        >
                          <TableCell className="font-mono font-semibold">
                            {f.fraction}
                          </TableCell>
                          <TableCell className="text-sm max-w-0 truncate">
                            <span className="block truncate">
                              {f.description}
                            </span>
                          </TableCell>
                          <TableCell>
                            <TariffRateBadge rate={f.generalDutyRate} />
                          </TableCell>
                          <TableCell>
                            <TariffRateBadge rate={f.vatRate} />
                          </TableCell>
                          <TableCell>
                            <ArrowRight
                              size={14}
                              className="text-muted-foreground"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-mono text-lg">
                        {selected.fraction}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs leading-relaxed">
                        {selected.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">{t('columnIGI')}</p>
                      <p className="font-mono font-bold text-base mt-1">
                        {selected.generalDutyRate
                          ? `${parseFloat(selected.generalDutyRate)}%`
                          : '—'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">{t('columnIVA')}</p>
                      <p className="font-mono font-bold text-base mt-1">
                        {selected.vatRate
                          ? `${parseFloat(selected.vatRate)}%`
                          : '—'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">UMC</p>
                      <p className="font-mono font-bold text-base mt-1">
                        {selected.unit ?? '—'}
                      </p>
                    </div>
                  </div>

                  {selected.tradeAgreementRates &&
                    selected.tradeAgreementRates.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          {t('tradeAgreements')}
                        </p>
                        <div className="space-y-1.5">
                          {selected.tradeAgreementRates.map((ta, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {ta.agreement}
                              </span>
                              <TariffRateBadge rate={ta.rate} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {selected.regulations && selected.regulations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {t('regulations')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selected.regulations.map((r, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button size="sm" variant="outline" className="w-full">
                    <Info size={14} className="mr-1.5" />
                    {t('notesLink')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                {t('selectFraction')}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
          {t('relatedTools')}
        </p>
        <a
          href="/dashboard/clasificacion/noms"
          className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/30 transition-colors"
        >
          <Certificate size={20} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{t('nomsTitle')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('nomsDesc')}</p>
          </div>
          <ArrowRight
            size={14}
            className="text-muted-foreground group-hover:translate-x-1 transition-transform"
          />
        </a>
      </div>
    </div>
  );
}
