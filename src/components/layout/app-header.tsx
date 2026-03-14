'use client';

import { useRouter } from 'next/navigation';
import { SignOut, User } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function AppHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const { clearOrg } = useOrgStore();

  const handleSignOut = async () => {
    await signOut();
    clearOrg();
    router.push('/sign-in');
    toast.success('Signed out');
  };

  const user = session?.user;

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <OrgSwitcher />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent transition-colors outline-none">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {user?.name ? getInitials(user.name) : <User size={12} />}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-32 truncate text-sm">
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
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
