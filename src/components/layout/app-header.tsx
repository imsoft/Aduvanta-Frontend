'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { SignOut, User, ShieldStar } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { signOut, useSession } from '@/lib/auth-client';
import { useOrgStore } from '@/store/org.store';
import { OrgSwitcher } from './org-switcher';
import { useIsSystemAdmin } from '@/features/system-admin/hooks/use-system-admin';

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function AppHeader() {
  const t = useTranslations()
  const router = useRouter()
  const { data: session } = useSession();
  const { clearOrg } = useOrgStore();
  const { data: adminStatus } = useIsSystemAdmin();

  const handleSignOut = async () => {
    await signOut();
    clearOrg();
    router.push('/sign-in');
    toast.success(t('header.signedOut'))
  };

  const user = session?.user;

  return (
    <header className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-2 border-b bg-background px-4 py-2 sm:flex-nowrap sm:py-0">
      <div className="min-w-0 flex-1">
        {adminStatus?.isSystemAdmin ? (
          <div className="flex items-center gap-2">
            <ShieldStar size={16} className="text-amber-500 shrink-0" weight="fill" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Super Admin</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Vista de plataforma
            </span>
          </div>
        ) : (
          <OrgSwitcher />
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex max-w-full min-w-0 items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-accent outline-none"
            >
              <Avatar className="h-6 w-6 shrink-0">
                {user?.image && <AvatarImage src={user.image} alt={user.name ?? ''} />}
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {user?.name ? getInitials(user.name) : <User size={12} />}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">
                {user?.name ?? user?.email}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut} className="gap-2 text-destructive focus:text-destructive">
              <SignOut size={14} />
              {t('auth.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
