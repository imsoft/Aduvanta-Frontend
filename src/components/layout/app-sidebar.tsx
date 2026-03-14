'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  ArrowsDownUp,
  Buildings,
  ChartBar,
  ClipboardText,
  Gear,
  House,
  LinkSimple,
  ListChecks,
  ShieldCheck,
  Upload,
  UsersThree,
  UsersFour,
  FileText,
  FolderOpen,
  Sparkle,
  CurrencyDollar,
  ChartLine,
  Flag,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { labelKey: 'nav.dashboard', href: '/dashboard', icon: House },
  { labelKey: 'nav.organizations', href: '/dashboard/organizations', icon: Buildings },
  { labelKey: 'nav.clients', href: '/dashboard/clients', icon: UsersFour },
  { labelKey: 'nav.operations', href: '/dashboard/operations', icon: FileText },
  { labelKey: 'nav.docCategories', href: '/dashboard/document-categories', icon: FolderOpen },
  { labelKey: 'nav.compliance', href: '/dashboard/compliance/rule-sets', icon: ListChecks },
  { labelKey: 'nav.aiCopilot', href: '/dashboard/ai', icon: Sparkle },
  { labelKey: 'nav.integrations', href: '/dashboard/integrations', icon: LinkSimple },
  { labelKey: 'nav.exports', href: '/dashboard/exports', icon: ArrowsDownUp },
  { labelKey: 'nav.imports', href: '/dashboard/imports', icon: Upload },
  { labelKey: 'nav.users', href: '/dashboard/users', icon: UsersThree },
  { labelKey: 'nav.roles', href: '/dashboard/roles', icon: ShieldCheck },
  { labelKey: 'nav.auditLogs', href: '/dashboard/audit-logs', icon: ClipboardText },
  { labelKey: 'nav.billing', href: '/dashboard/billing', icon: CurrencyDollar },
  { labelKey: 'nav.usage', href: '/dashboard/usage', icon: ChartLine },
  { labelKey: 'nav.featureFlags', href: '/dashboard/feature-flags', icon: Flag },
] as const

export function AppSidebar() {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-background">
      {/* Brand */}
      <div className="flex h-14 items-center px-4">
        <span className="text-sm font-semibold tracking-widest uppercase text-primary">
          Aduvanta
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {navItems.map(({ labelKey, href, icon: Icon }) => {
          const active =
            href === '/dashboard'
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <Icon size={16} weight={active ? 'fill' : 'regular'} />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom */}
      <div className="p-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
            pathname.startsWith('/dashboard/settings')
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
          )}
        >
          <Gear size={16} />
          {t('nav.settings')}
        </Link>
      </div>
    </aside>
  );
}
