'use client';

import { useState } from 'react';
import { useOrgUsage } from '@/features/system-admin/hooks/use-system-admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CaretLeft, CaretRight, Buildings } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

const PAGE_SIZE = 25;

const SUB_STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  TRIALING: 'bg-blue-100 text-blue-700',
  PAST_DUE: 'bg-orange-100 text-orange-700',
  CANCELLED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
};

export default function AdminUsoPage() {
  const [offset, setOffset] = useState(0);
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  const SUB_STATUS_LABELS: Record<string, string> = {
    ACTIVE: t('uso.statusActive'),
    TRIALING: t('uso.statusTrial'),
    PAST_DUE: t('uso.statusPastDue'),
    CANCELLED: t('uso.statusCancelled'),
    EXPIRED: t('uso.statusExpired'),
  };

  const { data, isLoading } = useOrgUsage(PAGE_SIZE, offset);
  const total = data?.total ?? 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('uso.title')}</h1>
          <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('uso.description')}
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
          <p className="text-sm font-medium">{t('uso.countLabel', { count: total.toLocaleString(locale) })}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t('common.page')} {page} {t('common.of')} {totalPages || 1}</span>
            <Button variant="outline" size="icon" className="h-6 w-6" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
              <CaretLeft size={12} />
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6" disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
              <CaretRight size={12} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 px-5 flex items-center gap-3">
                <div className="h-4 w-40 rounded bg-muted/40 animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted/30 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.usage.map((org) => (
              <div key={org.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Buildings size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{org.name}</p>
                    <span className="text-xs text-muted-foreground font-mono">{org.slug}</span>
                    {org.subscriptionStatus && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SUB_STATUS_COLORS[org.subscriptionStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                        {SUB_STATUS_LABELS[org.subscriptionStatus] ?? org.subscriptionStatus}
                      </span>
                    )}
                    {org.planName && (
                      <Badge variant="outline" className="text-[10px]">{org.planName}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('uso.created', { date: format(new Date(org.createdAt), 'dd MMM yyyy', { locale: dateLocale }) })}
                  </p>
                </div>
                <div className="hidden md:grid grid-cols-4 gap-6 text-center shrink-0">
                  <div>
                    <p className="text-lg font-semibold font-mono">{org.memberCount}</p>
                    <p className="text-[10px] text-muted-foreground">{t('uso.users')}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold font-mono">{org.operationCount}</p>
                    <p className="text-[10px] text-muted-foreground">{t('uso.operations')}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold font-mono">{org.entryCount}</p>
                    <p className="text-[10px] text-muted-foreground">{t('uso.entries')}</p>
                  </div>
                  <div>
                    <p className={`text-lg font-semibold font-mono ${org.entriesThisMonth > 0 ? 'text-blue-600' : ''}`}>
                      {org.entriesThisMonth}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{t('uso.thisMonth')}</p>
                  </div>
                </div>
              </div>
            ))}
            {data?.usage.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">{t('uso.noResults')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
