'use client';

import { useState } from 'react';
import { useAllUsers } from '@/features/system-admin/hooks/use-system-admin';
import { MagnifyingGlass, CaretLeft, CaretRight, ShieldStar, User } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

const PAGE_SIZE = 25;

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function AdminUsersPage() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  const { data, isLoading } = useAllUsers(PAGE_SIZE, offset, debouncedSearch || undefined);

  const total = data?.total ?? 0;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setOffset(0);
    // Simple debounce
    setTimeout(() => setDebouncedSearch(val), 300);
  };

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('users.title')}</h1>
          <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('users.description')}
        </p>
      </div>

      <div className="relative">
        <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('users.searchPlaceholder')}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
          <p className="text-sm font-medium">{t('users.countLabel', { count: total.toLocaleString(locale) })}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t('common.page')} {page} {t('common.of')} {totalPages || 1}</span>
            <Button variant="outline" size="icon" className="h-6 w-6" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
              <CaretLeft size={12} />
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6" disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
              <CaretRight size={12} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 px-5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted/40 animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-40 rounded bg-muted/40 animate-pulse" />
                  <div className="h-3 w-56 rounded bg-muted/30 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user.name ? getInitials(user.name) : <User size={12} />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium truncate">{user.name || '—'}</p>
                    {user.isSystemAdmin && (
                      <ShieldStar size={13} className="text-amber-500 shrink-0" weight="fill" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  {user.emailVerified ? (
                    <Badge variant="secondary" className="text-[10px] h-4">{t('users.verified')}</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] h-4">{t('users.unverified')}</Badge>
                  )}
                  <span>{user.orgCount} org{user.orgCount !== 1 ? 's' : ''}</span>
                  <span>{format(new Date(user.createdAt), 'dd MMM yyyy', { locale: dateLocale })}</span>
                </div>
              </div>
            ))}
            {data?.users.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                {t('users.noResults')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
