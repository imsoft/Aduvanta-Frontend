'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { label: 'Dashboard', href: '/dashboard', icon: House },
  { label: 'Organizations', href: '/dashboard/organizations', icon: Buildings },
  { label: 'Clients', href: '/dashboard/clients', icon: UsersFour },
  { label: 'Operations', href: '/dashboard/operations', icon: FileText },
  { label: 'Doc. Categories', href: '/dashboard/document-categories', icon: FolderOpen },
  { label: 'Compliance', href: '/dashboard/compliance/rule-sets', icon: ListChecks },
  { label: 'AI Copilot', href: '/dashboard/ai', icon: Sparkle },
  { label: 'Integrations', href: '/dashboard/integrations', icon: LinkSimple },
  { label: 'Exports', href: '/dashboard/exports', icon: ArrowsDownUp },
  { label: 'Imports', href: '/dashboard/imports', icon: Upload },
  { label: 'Users', href: '/dashboard/users', icon: UsersThree },
  { label: 'Roles', href: '/dashboard/roles', icon: ShieldCheck },
  { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: ClipboardText },
  { label: 'Billing', href: '/dashboard/billing', icon: CurrencyDollar },
  { label: 'Usage', href: '/dashboard/usage', icon: ChartLine },
  { label: 'Feature flags', href: '/dashboard/feature-flags', icon: Flag },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

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
        {navItems.map(({ label, href, icon: Icon }) => {
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
              {label}
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
          Settings
        </Link>
      </div>
    </aside>
  );
}
