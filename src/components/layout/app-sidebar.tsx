'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  Buildings,
  ChartBar,
  ClipboardText,
  Gear,
  House,
  LinkSimple,
  ListChecks,
  ShieldCheck,
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
  Scales,
  Warehouse,
  IdentificationCard,
  MagnifyingGlass,
  Clipboard,
  Bank,
  Receipt,
  ArrowsLeftRight,
  ShieldStar,
  Heartbeat,
  ChartPieSlice,
  Devices,
  CreditCard,
  BellRinging,
  BookOpen,
  Tag,
  type Icon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/layout/sidebar-context'
import { useIsSystemAdmin } from '@/features/system-admin/hooks/use-system-admin'
import { Logo } from '@/components/brand/logo'

type NavItem = {
  labelKey: string
  href: string
  icon: Icon
}

type NavGroup = {
  groupKey: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    groupKey: '',
    items: [
      { labelKey: 'nav.dashboard', href: '/dashboard', icon: House },
      { labelKey: 'nav.operations', href: '/dashboard/operations', icon: FileText },
      { labelKey: 'nav.clients', href: '/dashboard/clients', icon: UsersFour },
    ],
  },
  {
    groupKey: 'nav.groups.aduanas',
    items: [
      { labelKey: 'nav.pedimentos', href: '/dashboard/pedimentos', icon: ClipboardText },
      { labelKey: 'nav.clasificacion', href: '/dashboard/clasificacion', icon: Scales },
      { labelKey: 'nav.inspecciones', href: '/dashboard/inspecciones', icon: MagnifyingGlass },
      { labelKey: 'nav.previos', href: '/dashboard/previos', icon: Clipboard },
    ],
  },
  {
    groupKey: 'nav.groups.control',
    items: [
      { labelKey: 'nav.bodega', href: '/dashboard/bodega', icon: Warehouse },
      { labelKey: 'nav.tesoreria', href: '/dashboard/tesoreria', icon: Bank },
      { labelKey: 'nav.padron', href: '/dashboard/padron', icon: IdentificationCard },
      { labelKey: 'nav.reportes', href: '/dashboard/reportes', icon: ChartBar },
      { labelKey: 'nav.conversiones', href: '/dashboard/conversiones', icon: ArrowsLeftRight },
    ],
  },
  {
    groupKey: 'nav.groups.sistema',
    items: [
      { labelKey: 'nav.compliance', href: '/dashboard/compliance/rule-sets', icon: ListChecks },
      { labelKey: 'nav.docCategories', href: '/dashboard/document-categories', icon: FolderOpen },
      { labelKey: 'nav.aiCopilot', href: '/dashboard/ai', icon: Sparkle },
      { labelKey: 'nav.integrations', href: '/dashboard/integrations', icon: LinkSimple },
    ],
  },
  {
    groupKey: 'nav.groups.administracion',
    items: [
      { labelKey: 'nav.organizations', href: '/dashboard/organizations', icon: Buildings },
      { labelKey: 'nav.users', href: '/dashboard/users', icon: UsersThree },
      { labelKey: 'nav.roles', href: '/dashboard/roles', icon: ShieldCheck },
      { labelKey: 'nav.auditLogs', href: '/dashboard/audit-logs', icon: Receipt },
      { labelKey: 'nav.billing', href: '/dashboard/billing', icon: CurrencyDollar },
      { labelKey: 'nav.usage', href: '/dashboard/usage', icon: ChartLine },
      { labelKey: 'nav.featureFlags', href: '/dashboard/feature-flags', icon: Flag },
    ],
  },
]

const adminNavGroups: NavGroup[] = [
  {
    groupKey: '',
    items: [
      { labelKey: 'nav.admin.panel', href: '/dashboard/admin', icon: ShieldStar },
      { labelKey: 'nav.admin.health', href: '/dashboard/admin/health', icon: Heartbeat },
    ],
  },
  {
    groupKey: 'nav.groups.actividad',
    items: [
      { labelKey: 'nav.admin.pedimentos', href: '/dashboard/admin/pedimentos', icon: ClipboardText },
      { labelKey: 'nav.admin.operaciones', href: '/dashboard/admin/operaciones', icon: FileText },
    ],
  },
  {
    groupKey: 'nav.groups.tenants',
    items: [
      { labelKey: 'nav.admin.organizations', href: '/dashboard/admin/organizations', icon: Buildings },
      { labelKey: 'nav.admin.uso', href: '/dashboard/admin/uso', icon: ChartPieSlice },
      { labelKey: 'nav.admin.users', href: '/dashboard/admin/users', icon: UsersThree },
      { labelKey: 'nav.admin.sesiones', href: '/dashboard/admin/sesiones', icon: Devices },
      { labelKey: 'nav.admin.suscripciones', href: '/dashboard/admin/suscripciones', icon: CreditCard },
    ],
  },
  {
    groupKey: 'nav.groups.configuracion',
    items: [
      { labelKey: 'nav.admin.anuncios', href: '/dashboard/admin/anuncios', icon: BellRinging },
      { labelKey: 'nav.admin.descuentos', href: '/dashboard/admin/descuentos', icon: Tag },
      { labelKey: 'nav.admin.featureFlags', href: '/dashboard/admin/feature-flags', icon: Flag },
      { labelKey: 'nav.admin.catalogos', href: '/dashboard/admin/catalogos', icon: BookOpen },
      { labelKey: 'nav.admin.auditLogs', href: '/dashboard/admin/audit-logs', icon: Receipt },
    ],
  },
  {
    groupKey: 'nav.groups.contenido',
    items: [
      { labelKey: 'nav.admin.blog', href: '/dashboard/admin/blog', icon: BookOpen },
    ],
  },
]

export const AppSidebar = () => {
  const t = useTranslations()
  const pathname = usePathname()
  const { collapsed, toggle } = useSidebar()
  const { data: adminStatus } = useIsSystemAdmin()

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
          <button
            type="button"
            onClick={toggle}
            aria-expanded={false}
            aria-label={t('common.expandSidebar')}
            className="rounded-lg"
          >
            <Logo size={28} />
          </button>
        </div>
      ) : (
        <div className="flex h-14 items-center justify-between gap-2 border-b px-3">
          <div className="flex min-w-0 items-center gap-2">
            <Logo size={26} />
            <span className="min-w-0 truncate text-sm font-semibold uppercase tracking-widest text-primary">
              Aduvanta
            </span>
          </div>
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
      {adminStatus?.isSystemAdmin ? (
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-2">
          {!collapsed && (
            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-amber-500/80">
              Super Admin
            </p>
          )}
          {adminNavGroups.map((group) => (
            <div key={group.groupKey || '__top'} className="mb-1">
              {group.groupKey && !collapsed && (
                <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {t(group.groupKey)}
                </p>
              )}
              {group.items.map(({ labelKey, href, icon: Icon }) => {
                const label = t(labelKey)
                const active = href === '/dashboard/admin' ? pathname === href : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      'flex items-center rounded-md py-2 text-sm transition-colors',
                      collapsed ? 'justify-center px-0' : 'gap-2.5 px-3',
                      active
                        ? 'bg-amber-500/10 font-medium text-amber-600 dark:text-amber-400'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                    )}
                  >
                    <Icon
                      size={16}
                      className={cn('shrink-0', active && 'text-amber-500')}
                      weight={active ? 'fill' : 'regular'}
                      aria-hidden
                    />
                    <span className={cn(collapsed && 'sr-only')}>{label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      ) : (
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-2">
          {navGroups.map((group) => (
            <div key={group.groupKey || '__top'} className="mb-1">
              {group.groupKey && !collapsed && (
                <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {t(group.groupKey)}
                </p>
              )}
              {group.items.map(({ labelKey, href, icon: Icon }) => {
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
            </div>
          ))}
        </nav>
      )}

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
