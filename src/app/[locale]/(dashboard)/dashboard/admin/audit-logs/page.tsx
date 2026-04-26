'use client';

import { useState } from 'react';
import { useAllAuditLogs } from '@/features/system-admin/hooks/use-system-admin';
import { CaretLeft, CaretRight, ClockCounterClockwise } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

const PAGE_SIZE = 50;

export default function AdminAuditLogsPage() {
  const [offset, setOffset] = useState(0);
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  const { data, isLoading } = useAllAuditLogs(PAGE_SIZE, offset);
  const total = data?.total ?? 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('auditLogs.title')}</h1>
          <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{t('auditLogs.description')}</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
          <p className="text-sm font-medium">{t('auditLogs.countLabel', { count: total.toLocaleString(locale) })}</p>
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
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 px-5 flex items-center gap-3">
                <div className="h-4 w-32 rounded bg-muted/40 animate-pulse" />
                <div className="h-4 w-48 rounded bg-muted/30 animate-pulse" />
                <div className="h-4 w-20 rounded bg-muted/20 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y font-mono text-xs">
            {data?.logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-2.5 hover:bg-muted/20 transition-colors">
                <div className="shrink-0 mt-0.5">
                  <ClockCounterClockwise size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{log.action}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{log.resource}</span>
                    {log.resourceId && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground truncate max-w-32">{log.resourceId}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-muted-foreground">
                    {log.actorId && <span>{t('auditLogs.actor')}: {log.actorId.slice(0, 12)}…</span>}
                    {log.organizationId && <Badge variant="outline" className="text-[10px] font-mono py-0">{log.organizationId.slice(0, 8)}</Badge>}
                  </div>
                </div>
                <div className="shrink-0 text-muted-foreground whitespace-nowrap">
                  {log.createdAt ? format(new Date(log.createdAt), 'dd MMM HH:mm', { locale: dateLocale }) : '—'}
                </div>
              </div>
            ))}
            {data?.logs.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground font-sans">{t('auditLogs.noResults')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
