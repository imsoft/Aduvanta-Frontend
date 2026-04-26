'use client';

import { useAllFeatureFlags, useSetFeatureFlag } from '@/features/system-admin/hooks/use-system-admin';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

export default function AdminFeatureFlagsPage() {
  const { data: flags = [], isLoading } = useAllFeatureFlags();
  const setFlag = useSetFeatureFlag();
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  const globalFlags = flags.filter((f) => !f.organizationId);
  const orgFlags = flags.filter((f) => !!f.organizationId);

  const handleToggle = (key: string, current: boolean, organizationId?: string | null) => {
    setFlag.mutate({ key, isEnabled: !current, organizationId: organizationId ?? undefined });
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('featureFlags.title')}</h1>
          <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('featureFlags.description')}
        </p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && (
        <>
          <section className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
              {t('featureFlags.globalSection', { count: globalFlags.length })}
            </p>
            {globalFlags.length === 0 && (
              <div className="rounded-xl border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
                {t('featureFlags.noGlobalFlags')}
              </div>
            )}
            {globalFlags.map((flag) => (
              <FlagRow key={flag.id} flag={flag} onToggle={handleToggle} isPending={setFlag.isPending} updatedLabel={t('featureFlags.updatedAt', { date: flag.updatedAt ? format(new Date(flag.updatedAt), 'dd MMM yyyy HH:mm', { locale: dateLocale }) : '—' })} />
            ))}
          </section>

          {orgFlags.length > 0 && (
            <section className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                {t('featureFlags.orgSection', { count: orgFlags.length })}
              </p>
              {orgFlags.map((flag) => (
                <FlagRow key={flag.id} flag={flag} onToggle={handleToggle} isPending={setFlag.isPending} updatedLabel={t('featureFlags.updatedAt', { date: flag.updatedAt ? format(new Date(flag.updatedAt), 'dd MMM yyyy HH:mm', { locale: dateLocale }) : '—' })} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function FlagRow({
  flag,
  onToggle,
  isPending,
  updatedLabel,
}: {
  flag: { id: string; key: string; description: string | null; isEnabled: boolean; organizationId: string | null; updatedAt: string };
  onToggle: (key: string, current: boolean, organizationId?: string | null) => void;
  isPending: boolean;
  updatedLabel: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border px-5 py-3 hover:bg-muted/20 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-mono font-medium">{flag.key}</p>
          {flag.organizationId && (
            <Badge variant="outline" className="text-[10px] font-mono">
              org: {flag.organizationId.slice(0, 8)}
            </Badge>
          )}
        </div>
        {flag.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{flag.description}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {updatedLabel}
        </p>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => onToggle(flag.key, flag.isEnabled, flag.organizationId)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
          flag.isEnabled ? 'bg-green-500' : 'bg-muted'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
            flag.isEnabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
