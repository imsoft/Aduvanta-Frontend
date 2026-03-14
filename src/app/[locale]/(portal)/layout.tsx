'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useSession } from '@/lib/auth-client';

export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('common')
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/sign-in')
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground text-sm">
        {t('loading')}
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
