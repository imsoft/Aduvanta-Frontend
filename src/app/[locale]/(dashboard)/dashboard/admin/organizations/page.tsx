'use client';

import { useState } from 'react';
import { useAllOrganizations } from '@/features/system-admin/hooks/use-system-admin';
import { Buildings, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

const PAGE_SIZE = 25;

export default function AdminOrganizationsPage() {
  const [offset, setOffset] = useState(0);
  const { data, isLoading } = useAllOrganizations(PAGE_SIZE, offset);
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  const total = data?.total ?? 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('organizations.title')}</h1>
          <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('organizations.description')}
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
          <p className="text-sm font-medium">{t('organizations.countLabel', { count: total.toLocaleString(locale) })}</p>
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
              <div key={i} className="h-14 px-5 flex items-center gap-3">
                <div className="h-4 w-48 rounded bg-muted/40 animate-pulse" />
                <div className="h-4 w-20 rounded bg-muted/30 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.organizations.map((org) => (
              <div key={org.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Buildings size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{org.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">/{org.slug}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span>{org.memberCount} {t('organizations.members')}</span>
                  <span>{org.operationCount} {t('organizations.ops')}</span>
                  <span>{org.entryCount} {t('organizations.entries')}</span>
                  <span>{format(new Date(org.createdAt), 'dd MMM yyyy', { locale: dateLocale })}</span>
                </div>
              </div>
            ))}
            {data?.organizations.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                {t('organizations.noResults')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
