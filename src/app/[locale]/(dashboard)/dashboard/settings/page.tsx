'use client';

import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations();

  return (
    <div className="w-full space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('settings.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('settings.description')}
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">{t('common.comingSoon')}</p>
      </div>
    </div>
  );
}
