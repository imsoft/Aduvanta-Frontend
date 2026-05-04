'use client';

import { useState } from 'react';
import { Handshake } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradeAgreements } from '@/features/trade-agreements/hooks/use-trade-agreements';

const limit = 12;

export default function TlcsPage() {
  const t = useTranslations('tradeAgreements');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useTradeAgreements({ q: search || undefined, limit, offset });

  const agreements = data?.agreements ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
      </div>

      <Input
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
        className="max-w-sm"
      />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-lg border bg-muted/20 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && agreements.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Handshake size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('empty')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('adjustFilters')}</p>
        </div>
      )}

      {!isLoading && agreements.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agreements.map((a) => (
              <Card key={a.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-mono text-lg">{a.code}</CardTitle>
                    <Badge
                      variant="outline"
                      className={a.isActive
                        ? 'text-green-700 border-green-200 bg-green-50'
                        : 'text-gray-500 border-gray-200 bg-gray-50'}
                    >
                      {a.isActive ? t('active') : t('inactive')}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm font-medium text-foreground/80">
                    {a.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-1">
                  <p className="line-clamp-2">{a.partnerCountries}</p>
                  {a.effectiveDate && (
                    <p>{t('effectiveFrom')} {new Date(a.effectiveDate).toLocaleDateString()}</p>
                  )}
                </CardContent>
              </Card>
            ))}
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
