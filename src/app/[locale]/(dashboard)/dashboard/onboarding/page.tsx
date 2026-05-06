'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { CheckCircle, User, Users, Buildings, Confetti } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { useOrgStore } from '@/store/org.store';
import { useOnboardingStore, type OnboardingStep } from '@/store/onboarding.store';
import { useSession } from '@/lib/auth-client';

const STEPS: { key: OnboardingStep; label: string; icon: React.ElementType }[] = [
  { key: 'profile', label: 'Perfil', icon: User },
  { key: 'team', label: 'Equipo', icon: Users },
  { key: 'client', label: 'Cliente', icon: Buildings },
  { key: 'done', label: 'Listo', icon: Confetti },
];

function StepIndicator({ current }: { current: OnboardingStep }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 border text-xs font-medium transition-colors
                ${done ? 'bg-foreground text-background border-foreground' : active ? 'border-foreground text-foreground' : 'border-muted-foreground/30 text-muted-foreground'}`}
            >
              {done ? <CheckCircle size={16} weight="fill" /> : <Icon size={16} />}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-12 ${i < currentIdx ? 'bg-foreground' : 'bg-muted-foreground/30'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProfileStep({ onNext }: { onNext: () => void }) {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (name.trim() && name !== session?.user?.name) {
        await apiClient.patch('/api/auth/update-user', { name: name.trim() });
      }
      onNext();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Tu perfil</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Confirma cómo aparecerá tu nombre en la plataforma.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Nombre completo</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
      </div>
      <div className="space-y-1">
        <Label>Correo electrónico</Label>
        <Input value={session?.user?.email ?? ''} disabled className="text-muted-foreground" />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando…' : 'Continuar'}
      </Button>
    </div>
  );
}

function TeamStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const { activeOrgId } = useOrgStore();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async () => {
    if (!email.trim() || !activeOrgId) return;
    setSending(true);
    setError('');
    try {
      await apiClient.post(
        '/api/organizations/invite',
        { email: email.trim() },
        { headers: { 'x-organization-id': activeOrgId } },
      );
      setSent(true);
      setEmail('');
    } catch {
      setError('No se pudo enviar la invitación. Verifica el correo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Invita a tu equipo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Puedes invitar a compañeros ahora o hacerlo más tarde desde Configuración.
        </p>
      </div>
      {sent && (
        <div className="border border-green-300 bg-green-50 p-3 text-sm text-green-800">
          Invitación enviada. Puedes invitar a más personas o continuar.
        </div>
      )}
      {error && (
        <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      <div className="space-y-2">
        <Label>Correo del colaborador</Label>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colega@empresa.com"
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
          <Button onClick={handleInvite} disabled={sending || !email.trim()} className="shrink-0">
            {sending ? 'Enviando…' : 'Invitar'}
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onNext}>Continuar</Button>
        <Button variant="ghost" onClick={onSkip}>
          Omitir por ahora
        </Button>
      </div>
    </div>
  );
}

function ClientStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const { activeOrgId } = useOrgStore();
  const [businessName, setBusinessName] = useState('');
  const [rfc, setRfc] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!businessName.trim() || !activeOrgId) return;
    setSaving(true);
    setError('');
    try {
      await apiClient.post(
        '/api/clients',
        { businessName: businessName.trim(), rfc: rfc.trim() || undefined },
        { headers: { 'x-organization-id': activeOrgId } },
      );
      onNext();
    } catch {
      setError('No se pudo crear el cliente. Puedes hacerlo más tarde desde Clientes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Agrega tu primer cliente</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Registra al primer cliente para el que tramitarás pedimentos.
        </p>
      </div>
      {error && (
        <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      <div className="space-y-2">
        <Label>Razón social</Label>
        <Input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="EMPRESA IMPORTADORA SA DE CV"
        />
      </div>
      <div className="space-y-2">
        <Label>RFC (opcional)</Label>
        <Input
          value={rfc}
          onChange={(e) => setRfc(e.target.value.toUpperCase())}
          placeholder="EIM000101AAA"
          maxLength={13}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving || !businessName.trim()}>
          {saving ? 'Guardando…' : 'Crear cliente y continuar'}
        </Button>
        <Button variant="ghost" onClick={onSkip}>
          Omitir por ahora
        </Button>
      </div>
    </div>
  );
}

function DoneStep() {
  const router = useRouter();
  return (
    <div className="space-y-4 text-center py-4">
      <Confetti size={48} className="mx-auto text-foreground" />
      <div>
        <h2 className="text-xl font-semibold">¡Todo listo!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tu cuenta está configurada. Puedes empezar a operar.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
        <Button onClick={() => router.push('/dashboard/pedimentos/nuevo')}>
          Crear primer pedimento
        </Button>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Ir al dashboard
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { currentStep, setStep, completeStep } = useOnboardingStore();

  const advance = (from: OnboardingStep, to: OnboardingStep) => {
    completeStep(from);
    setStep(to);
  };

  return (
    <div className="max-w-lg mx-auto pt-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Configuración inicial</h1>
        <p className="text-sm text-muted-foreground">
          Completa los pasos para empezar a usar Aduvanta.
        </p>
      </div>

      <StepIndicator current={currentStep} />

      <div className="border p-6">
        {currentStep === 'profile' && (
          <ProfileStep onNext={() => advance('profile', 'team')} />
        )}
        {currentStep === 'team' && (
          <TeamStep
            onNext={() => advance('team', 'client')}
            onSkip={() => advance('team', 'client')}
          />
        )}
        {currentStep === 'client' && (
          <ClientStep
            onNext={() => advance('client', 'done')}
            onSkip={() => advance('client', 'done')}
          />
        )}
        {currentStep === 'done' && <DoneStep />}
      </div>
    </div>
  );
}
