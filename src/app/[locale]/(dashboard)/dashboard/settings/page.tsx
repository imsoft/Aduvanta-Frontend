'use client';

import { useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { useOrgStore } from '@/store/org.store';
import { routing } from '@/i18n/routing';
import { toast } from 'sonner';
import { Sun, Moon, Desktop, Globe, User, SignOut, ShieldCheck, Camera } from '@phosphor-icons/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

const THEMES = [
  { id: 'light', icon: Sun, labelKey: 'theme.light' },
  { id: 'dark', icon: Moon, labelKey: 'theme.dark' },
  { id: 'system', icon: Desktop, labelKey: 'theme.system' },
] as const;

const LOCALE_META: Record<string, { label: string; flag: string }> = {
  'es-MX': { label: 'Español (México)', flag: '🇲🇽' },
  'en-US': { label: 'English (US)', flag: '🇺🇸' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { clearOrg } = useOrgStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const user = session?.user;
  const displayImage = avatarUrl ?? user?.image ?? null;

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleSignOut = async () => {
    await signOut();
    clearOrg();
    router.push('/sign-in');
    toast.success(t('header.signedOut'));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const { data } = await apiClient.post<{ imageUrl: string }>(
        '/api/users/me/avatar',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setAvatarUrl(data.imageUrl);
      toast.success(t('settings.profile.avatarUpdated'));
    } catch {
      setAvatarUrl(user?.image ?? null);
      toast.error(t('settings.profile.avatarError'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('settings.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('settings.description')}</p>
      </div>

      {/* Perfil */}
      <Section
        title={t('settings.profile.title')}
        description={t('settings.profile.description')}
      >
        <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative h-14 w-14 shrink-0 rounded-full group"
            aria-label={t('settings.profile.changeAvatar')}
          >
            <Avatar className="h-14 w-14">
              {displayImage && <AvatarImage src={displayImage} alt={user?.name ?? ''} />}
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {user?.name ? getInitials(user.name) : <User size={22} />}
              </AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : <Camera size={18} className="text-white" weight="bold" />}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{user?.name ?? '—'}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            {user?.emailVerified && (
              <Badge variant="secondary" className="mt-1.5 text-[10px] gap-1 h-4">
                <ShieldCheck size={10} />
                {t('settings.profile.verified')}
              </Badge>
            )}
            <p className="text-xs text-muted-foreground mt-1">{t('settings.profile.clickToChangeAvatar')}</p>
          </div>
        </div>
      </Section>

      <Separator />

      {/* Apariencia */}
      <Section
        title={t('settings.appearance.title')}
        description={t('settings.appearance.description')}
      >
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ id, icon: Icon, labelKey }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border p-4 transition-all hover:bg-accent/40',
                  active
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border',
                )}
              >
                {/* Mini preview */}
                <div
                  className={cn(
                    'w-full rounded-lg border overflow-hidden',
                    id === 'dark' ? 'bg-zinc-900 border-zinc-700' : id === 'light' ? 'bg-white border-zinc-200' : 'bg-linear-to-br from-white to-zinc-800 border-zinc-300',
                  )}
                >
                  <div className={cn('h-2 w-full', id === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100')} />
                  <div className="p-2 space-y-1">
                    <div className={cn('h-1.5 w-3/4 rounded-full', id === 'dark' ? 'bg-zinc-600' : 'bg-zinc-200')} />
                    <div className={cn('h-1.5 w-1/2 rounded-full', id === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100')} />
                    <div className={cn('h-1.5 w-5 rounded-full mt-2', id === 'dark' ? 'bg-blue-500' : 'bg-blue-400')} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon size={13} className={active ? 'text-primary' : 'text-muted-foreground'} />
                  <span className={cn('text-xs font-medium', active ? 'text-primary' : 'text-foreground')}>
                    {t(labelKey)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Separator />

      {/* Idioma */}
      <Section
        title={t('settings.language.title')}
        description={t('settings.language.description')}
      >
        <div className="flex flex-col gap-2">
          {routing.locales.map((loc) => {
            const meta = LOCALE_META[loc] ?? { label: loc, flag: '🌐' };
            const active = locale === loc;
            return (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all hover:bg-accent/40',
                  active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border',
                )}
              >
                <span className="text-xl leading-none">{meta.flag}</span>
                <span className={cn('flex-1 text-sm font-medium', active && 'text-primary')}>
                  {meta.label}
                </span>
                {active && (
                  <Badge variant="secondary" className="text-[10px] h-4 shrink-0">
                    {t('settings.language.active')}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      <Separator />

      {/* Sesión */}
      <Section
        title={t('settings.session.title')}
        description={t('settings.session.description')}
      >
        <div className="rounded-xl border bg-card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Globe size={16} className="text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={handleSignOut}
          >
            <SignOut size={14} />
            {t('auth.signOut')}
          </Button>
        </div>
      </Section>
    </div>
  );
}
