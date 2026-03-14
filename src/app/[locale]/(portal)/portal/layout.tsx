'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { ClipboardText, SignOut, User } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut, useSession } from '@/lib/auth-client';
import { useOrgStore } from '@/store/org.store';

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const navItems = [
  { label: 'Operations', href: '/portal/operations', icon: ClipboardText },
] as const;

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { clearOrg } = useOrgStore();

  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    clearOrg();
    router.push('/sign-in');
    toast.success('Signed out');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex h-full w-52 flex-col border-r bg-background">
        <div className="flex h-14 items-center gap-2 px-4">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary">
            Aduvanta
          </span>
          <span className="text-xs text-muted-foreground">Portal</span>
        </div>

        <Separator />

        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
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

        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {user?.name ? getInitials(user.name) : <User size={12} />}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {user?.name ?? user?.email}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
            title="Sign out"
          >
            <SignOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
