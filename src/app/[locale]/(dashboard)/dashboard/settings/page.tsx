'use client';

import { useRef, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSession, signOut, authClient } from '@/lib/auth-client';
import { useOrgStore } from '@/store/org.store';
import { routing } from '@/i18n/routing';
import { toast } from 'sonner';
import {
  Sun, Moon, Desktop, Globe, User, SignOut, ShieldCheck, Camera,
  LockKey, ShieldWarning, DeviceMobile, X, Warning, Envelope,
} from '@phosphor-icons/react';
import { GoogleIcon } from '@/components/ui/icons/google-icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';

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
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  );
}

// --- 2FA Section ---

type TwoFaStep = 'idle' | 'qr' | 'verify' | 'backup-codes' | 'disable-confirm';

function TwoFaSection({ isOAuthUser }: { isOAuthUser: boolean }) {
  const { data: session, refetch } = useSession();
  const [step, setStep] = useState<TwoFaStep>('idle');
  const [password, setPassword] = useState('');
  const [totpUri, setTotpUri] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [code, setCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEnabled = (session?.user as Record<string, unknown> | undefined)?.twoFactorEnabled === true;

  if (isOAuthUser) {
    return (
      <div className="border p-5 space-y-3 opacity-60">
        <div className="flex items-center gap-3">
          <ShieldWarning size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Verificación en dos pasos (2FA)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tu cuenta usa Google para autenticarse. El 2FA lo gestiona directamente Google.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border px-3 py-2">
          <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
          Administrado por Google — no disponible aquí
        </div>
      </div>
    );
  }

  const handleEnable = async () => {
    if (!password) { setError('Ingresa tu contraseña para continuar.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authClient.twoFactor.enable({ password });
      if (res.error) { setError(res.error.message ?? 'Error al activar 2FA.'); return; }
      const uri = res.data?.totpURI ?? '';
      setTotpUri(uri);
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`);
      setBackupCodes((res.data as Record<string, unknown>)?.backupCodes as string[] ?? []);
      setStep('qr');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) { setError('Ingresa el código de 6 dígitos.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authClient.twoFactor.verifyTotp({ code });
      if (res.error) { setError('Código incorrecto. Intenta de nuevo.'); return; }
      setStep('backup-codes');
      await refetch();
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!password) { setError('Ingresa tu contraseña para continuar.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authClient.twoFactor.disable({ password });
      if (res.error) { setError(res.error.message ?? 'Error al desactivar 2FA.'); return; }
      toast.success('Verificación en dos pasos desactivada.');
      setStep('idle');
      setPassword('');
      await refetch();
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep('idle'); setPassword(''); setCode(''); setError(''); };

  return (
    <div className="border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldWarning size={20} className={isEnabled ? 'text-green-600' : 'text-muted-foreground'} />
          <div>
            <p className="text-sm font-medium">Verificación en dos pasos (2FA)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEnabled
                ? 'Activo — tu cuenta requiere código TOTP al iniciar sesión.'
                : 'Inactivo — cualquiera con tu contraseña puede acceder.'}
            </p>
          </div>
        </div>
        <Badge variant={isEnabled ? 'default' : 'secondary'} className="shrink-0">
          {isEnabled ? 'Activado' : 'Inactivo'}
        </Badge>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

      {step === 'idle' && !isEnabled && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Tu contraseña actual</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              onKeyDown={(e) => e.key === 'Enter' && handleEnable()}
            />
          </div>
          <Button size="sm" onClick={handleEnable} disabled={loading || !password}>
            {loading ? 'Activando…' : 'Activar 2FA'}
          </Button>
        </div>
      )}

      {step === 'qr' && (
        <div className="space-y-4">
          <p className="text-sm">
            Escanea este código QR con tu app de autenticación (Google Authenticator, Authy, etc.).
          </p>
          {qrUrl && (
            <div className="border inline-block p-2">
              <Image src={qrUrl} alt="QR 2FA" width={200} height={200} unoptimized />
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Código de verificación (6 dígitos)</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="font-mono w-32"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleVerify} disabled={loading || code.length !== 6}>
              {loading ? 'Verificando…' : 'Verificar y activar'}
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>Cancelar</Button>
          </div>
        </div>
      )}

      {step === 'backup-codes' && (
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-sm font-medium text-yellow-800">Guarda tus códigos de respaldo</p>
            <p className="text-xs text-yellow-700 mt-1">
              Si pierdes acceso a tu app, usa uno de estos códigos. Cada código es de un solo uso.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((c) => (
              <code key={c} className="text-xs font-mono bg-muted px-2 py-1 border">{c}</code>
            ))}
          </div>
          <Button size="sm" onClick={() => { toast.success('2FA activado correctamente.'); reset(); }}>
            He guardado los códigos
          </Button>
        </div>
      )}

      {step === 'idle' && isEnabled && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Confirma tu contraseña para desactivar</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña actual"
            />
          </div>
          <Button size="sm" variant="destructive" onClick={handleDisable} disabled={loading || !password}>
            {loading ? 'Desactivando…' : 'Desactivar 2FA'}
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Password Change Section ---

function PasswordSection({ isOAuthUser }: { isOAuthUser: boolean }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async () => {
    setError('');
    if (next !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (next.length < 12) { setError('La contraseña debe tener al menos 12 caracteres.'); return; }
    if (!/[A-Z]/.test(next)) { setError('Debe incluir al menos una mayúscula.'); return; }
    if (!/[0-9]/.test(next)) { setError('Debe incluir al menos un número.'); return; }
    if (!/[^A-Za-z0-9]/.test(next)) { setError('Debe incluir al menos un carácter especial.'); return; }

    setLoading(true);
    try {
      const res = await authClient.changePassword({ currentPassword: current, newPassword: next });
      if (res.error) { setError(res.error.message ?? 'Error al cambiar contraseña.'); return; }
      toast.success('Contraseña actualizada correctamente.');
      setCurrent(''); setNext(''); setConfirm('');
    } finally {
      setLoading(false);
    }
  };

  if (isOAuthUser) {
    return (
      <div className="border p-5 space-y-3 opacity-60">
        <div className="flex items-center gap-3">
          <LockKey size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Contraseña</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tu cuenta no tiene contraseña — el acceso lo gestiona Google.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border px-3 py-2">
          <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
          Administrado por Google — no disponible aquí
        </div>
      </div>
    );
  }

  return (
    <div className="border p-5 space-y-4">
      <div className="flex items-center gap-3">
        <LockKey size={20} className="text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Cambiar contraseña</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mínimo 12 caracteres, mayúsculas, números y símbolos.
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Contraseña actual</Label>
          <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Nueva contraseña</Label>
          <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Confirmar nueva contraseña</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChange()}
          />
        </div>
        <Button size="sm" onClick={handleChange} disabled={loading || !current || !next || !confirm}>
          {loading ? 'Guardando…' : 'Actualizar contraseña'}
        </Button>
      </div>
    </div>
  );
}

// --- Sessions Section ---

interface ActiveSessionData {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: string;
  current?: boolean;
}

function SessionsSection() {
  const [sessions, setSessions] = useState<ActiveSessionData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authClient.listSessions();
      setSessions((res.data as ActiveSessionData[] | null) ?? []);
    } finally {
      setLoading(false);
    }
  };

  const revoke = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      await authClient.revokeSession({ token: sessionId });
      setSessions((prev) => prev?.filter((s) => s.id !== sessionId) ?? null);
      toast.success('Sesión cerrada.');
    } finally {
      setRevoking(null);
    }
  };

  const revokeAll = async () => {
    setLoading(true);
    try {
      await authClient.revokeOtherSessions();
      toast.success('Otras sesiones cerradas.');
      setSessions(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DeviceMobile size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Sesiones activas</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dispositivos y navegadores con sesión abierta.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {sessions && sessions.length > 1 && (
            <Button size="sm" variant="outline" onClick={revokeAll} disabled={loading}>
              Cerrar otras
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
            {loading ? 'Cargando…' : sessions ? 'Actualizar' : 'Ver sesiones'}
          </Button>
        </div>
      </div>

      {sessions && (
        <div className="space-y-2">
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin sesiones activas.</p>
          )}
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 border p-3 text-xs">
              <div className="min-w-0">
                <p className="font-medium truncate">{s.userAgent ?? 'Dispositivo desconocido'}</p>
                <p className="text-muted-foreground mt-0.5">
                  {s.ipAddress ?? 'IP desconocida'} — Iniciada {new Date(s.createdAt).toLocaleDateString('es-MX')}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => revoke(s.id)}
                disabled={revoking === s.id}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Danger Zone (LFPDPPP Right to Erasure) ---

function DangerZoneSection() {
  const router = useRouter();
  const { clearOrg } = useOrgStore();
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const CONFIRM_WORD = 'ELIMINAR';

  const handleDelete = async () => {
    if (confirm !== CONFIRM_WORD) return;
    setLoading(true);
    try {
      await apiClient.delete('/api/users/me');
      await signOut();
      clearOrg();
      toast.success('Tu cuenta ha sido eliminada.');
      router.push('/sign-in');
    } catch {
      toast.error('No se pudo eliminar la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-destructive/40 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Warning size={20} className="text-destructive shrink-0" />
        <div>
          <p className="text-sm font-medium text-destructive">Eliminar cuenta</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Elimina permanentemente tu cuenta y todos tus datos personales (LFPDPPP, Art. 24).
          </p>
        </div>
      </div>

      {!open ? (
        <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
          Solicitar eliminación de cuenta
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="bg-destructive/5 border border-destructive/20 p-3 text-xs text-destructive space-y-1">
            <p className="font-medium">Esta acción es irreversible.</p>
            <p>Se anonimizarán tu nombre, correo e imagen. Las operaciones y pedimentos de tu organización se conservan por obligación fiscal (SAT, 5 años).</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">
              Escribe <span className="font-mono font-bold">{CONFIRM_WORD}</span> para confirmar
            </Label>
            <Input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={CONFIRM_WORD}
              className="font-mono w-40"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || confirm !== CONFIRM_WORD}
            >
              {loading ? 'Eliminando…' : 'Eliminar mi cuenta'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setOpen(false); setConfirm(''); }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---

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

  const [provider, setProvider] = useState<'google' | 'credential' | null>(null);

  useEffect(() => {
    apiClient.get<Array<{ provider: string }>>('/api/auth/list-accounts')
      .then(({ data }) => {
        if (data.some((a) => a.provider === 'google')) setProvider('google');
        else setProvider('credential');
      })
      .catch(() => setProvider('credential'));
  }, []);

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
      <Section title={t('settings.profile.title')} description={t('settings.profile.description')}>
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
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {user?.emailVerified && (
                <Badge variant="secondary" className="text-[10px] gap-1 h-4">
                  <ShieldCheck size={10} />
                  {t('settings.profile.verified')}
                </Badge>
              )}
              {provider === 'google' && (
                <Badge variant="outline" className="text-[10px] gap-1 h-4">
                  <GoogleIcon className="h-2.5 w-2.5" />
                  Registrado con Google
                </Badge>
              )}
              {provider === 'credential' && (
                <Badge variant="outline" className="text-[10px] gap-1 h-4">
                  <Envelope size={10} />
                  Registrado con correo
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('settings.profile.clickToChangeAvatar')}</p>
          </div>
        </div>
      </Section>

      <Separator />

      {/* Seguridad */}
      <Section title="Seguridad" description="Gestiona la autenticación y protección de tu cuenta.">
        <TwoFaSection isOAuthUser={provider === 'google'} />
        <PasswordSection isOAuthUser={provider === 'google'} />
        <SessionsSection />
      </Section>

      <Separator />

      {/* Apariencia */}
      <Section title={t('settings.appearance.title')} description={t('settings.appearance.description')}>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ id, icon: Icon, labelKey }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border p-4 transition-all hover:bg-accent/40',
                  active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border',
                )}
              >
                <div className={cn('w-full rounded-lg border overflow-hidden',
                  id === 'dark' ? 'bg-zinc-900 border-zinc-700' : id === 'light' ? 'bg-white border-zinc-200' : 'bg-linear-to-br from-white to-zinc-800 border-zinc-300')}>
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
      <Section title={t('settings.language.title')} description={t('settings.language.description')}>
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
                <span className={cn('flex-1 text-sm font-medium', active && 'text-primary')}>{meta.label}</span>
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
      <Section title={t('settings.session.title')} description={t('settings.session.description')}>
        <div className="rounded-xl border bg-card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Globe size={16} className="text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0 gap-1.5" onClick={handleSignOut}>
            <SignOut size={14} />
            {t('auth.signOut')}
          </Button>
        </div>
      </Section>

      <Separator />

      {/* Zona de peligro — LFPDPPP derecho al olvido */}
      <Section title="Zona de peligro" description="Acciones permanentes e irreversibles sobre tu cuenta.">
        <DangerZoneSection />
      </Section>
    </div>
  );
}
