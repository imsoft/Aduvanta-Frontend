'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CurrencyDollar, Bank, ArrowRight } from '@phosphor-icons/react';

export default function TesoreriaPage() {
  const t = useTranslations('treasury');

  const sections = [
    { href: '/dashboard/tesoreria/cuentas', icon: CurrencyDollar, title: t('accounts'), description: t('accountsDesc') },
    { href: '/dashboard/tesoreria/fondos', icon: Bank, title: t('funds'), description: t('fundsDesc') },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}
            className="group rounded-lg border p-6 hover:bg-muted/30 transition-colors flex gap-4">
            <section.icon size={28} className="text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">{section.title}</p>
                <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
