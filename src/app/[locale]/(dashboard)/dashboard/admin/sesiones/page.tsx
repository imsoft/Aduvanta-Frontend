'use client';

import { useState } from 'react';
import { useActiveSessions, useRevokeSession } from '@/features/system-admin/hooks/use-system-admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CaretLeft, CaretRight, DeviceMobile, Desktop, Globe, ShieldStar, Trash } from '@phosphor-icons/react';
import { format, formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';

const PAGE_SIZE = 50;

function parseDevice(ua: string | null, unknownLabel: string, mobileLabel: string, desktopLabel: string): { icon: typeof Desktop; label: string } {
  if (!ua) return { icon: Globe, label: unknownLabel };
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return { icon: DeviceMobile, label: mobileLabel };
  return { icon: Desktop, label: desktopLabel };
}

function parseBrowser(ua: string | null, otherLabel: string): string {
  if (!ua) return '—';
  if (/Chrome/i.test(ua) && !/Chromium|Edge|OPR/i.test(ua)) return 'Chrome';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/Edge/i.test(ua)) return 'Edge';
  if (/OPR/i.test(ua)) return 'Opera';
  return otherLabel;
}

export default function AdminSesionesPage() {
  const [offset, setOffset] = useState(0);
  const [revoking, setRevoking] = useState<string | null>(null);
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  const { data, isLoading } = useActiveSessions(PAGE_SIZE, offset);
  const revoke = useRevokeSession();

  const total = data?.total ?? 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleRevoke = async (sessionId: string, email: string) => {
    setRevoking(sessionId);
    try {
      await revoke.mutateAsync(sessionId);
      toast.success(t('sesiones.toastRevoked', { email }));
    } catch {
      toast.error(t('sesiones.toastError'));
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('sesiones.title')}</h1>
          <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('sesiones.description')}
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
          <p className="text-sm font-medium">{t('sesiones.countLabel', { count: total.toLocaleString(locale) })}</p>
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
                <div className="h-8 w-8 rounded-full bg-muted/40 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-40 rounded bg-muted/40 animate-pulse" />
                  <div className="h-3 w-28 rounded bg-muted/30 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.sessions.map((session) => {
              const { icon: DeviceIcon, label: deviceLabel } = parseDevice(
                session.userAgent,
                t('sesiones.unknown'),
                t('sesiones.mobile'),
                t('sesiones.desktop'),
              );
              const browser = parseBrowser(session.userAgent, t('sesiones.other'));
              return (
                <div key={session.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <DeviceIcon size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{session.userName}</p>
                      <span className="text-xs text-muted-foreground">{session.userEmail}</span>
                      {session.isSystemAdmin && (
                        <ShieldStar size={12} className="text-amber-500" weight="fill" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {deviceLabel} · {browser}
                      {session.ipAddress && ` · ${session.ipAddress}`}
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground shrink-0">
                    <span>{t('sesiones.started', { time: formatDistanceToNow(new Date(session.createdAt), { locale: dateLocale, addSuffix: true }) })}</span>
                    <span>{t('sesiones.expires', { date: format(new Date(session.expiresAt), 'dd MMM yyyy', { locale: dateLocale }) })}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={revoking === session.id}
                    onClick={() => handleRevoke(session.id, session.userEmail)}
                  >
                    <Trash size={13} />
                  </Button>
                </div>
              );
            })}
            {data?.sessions.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">{t('sesiones.noResults')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
