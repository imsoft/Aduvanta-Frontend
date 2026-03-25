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
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/layout/sidebar-context'

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

export const AppSidebar = () => {
  const t = useTranslations()
  const pathname = usePathname()
  const { collapsed, toggle } = useSidebar()

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r bg-background transition-[width] duration-200 ease-out',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      {/* Brand + toggle */}
      {collapsed ? (
        <div className="flex h-14 flex-col items-center justify-center gap-1 border-b px-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={toggle}
            aria-expanded={false}
            aria-label={t('common.expandSidebar')}
          >
            <CaretRight size={18} weight="bold" aria-hidden />
          </Button>
        </div>
      ) : (
        <div className="flex h-14 items-center justify-between gap-2 border-b px-2">
          <span className="min-w-0 truncate text-sm font-semibold uppercase tracking-widest text-primary">
            Aduvanta
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={toggle}
            aria-expanded
            aria-label={t('common.collapseSidebar')}
          >
            <CaretLeft size={18} weight="bold" aria-hidden />
          </Button>
        </div>
      )}

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-2">
        {navItems.map(({ labelKey, href, icon: Icon }) => {
          const active =
            href === '/dashboard'
              ? pathname === href
              : pathname.startsWith(href)
          const label = t(labelKey)

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-md py-2 text-sm transition-colors',
                collapsed ? 'justify-center px-0' : 'gap-2.5 px-3',
                active
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <Icon
                size={16}
                className="shrink-0"
                weight={active ? 'fill' : 'regular'}
                aria-hidden
              />
              <span className={cn(collapsed && 'sr-only')}>{label}</span>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Bottom */}
      <div className="p-2">
        <Link
          href="/dashboard/settings"
          title={collapsed ? t('nav.settings') : undefined}
          className={cn(
            'flex items-center rounded-md py-2 text-sm transition-colors',
            collapsed ? 'justify-center px-0' : 'gap-2.5 px-3',
            pathname.startsWith('/dashboard/settings')
              ? 'bg-accent font-medium text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
          )}
        >
          <Gear size={16} className="shrink-0" aria-hidden />
          <span className={cn(collapsed && 'sr-only')}>{t('nav.settings')}</span>
        </Link>
      </div>
    </aside>
  )
}
