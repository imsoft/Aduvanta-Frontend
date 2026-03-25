'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useSession } from '@/lib/auth-client';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { AnalyticsTracker } from '@/components/analytics-tracker';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('common')
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/sign-in');
    }
  }, [session, isPending, router]);

  if (isPending) {
      return (
      <div className="flex h-screen items-center justify-center text-muted-foreground text-sm">
        {t('loading')}
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AnalyticsTracker />
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
