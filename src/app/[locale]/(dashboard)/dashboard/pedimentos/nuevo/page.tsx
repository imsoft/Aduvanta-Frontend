'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { ArrowLeft } from '@phosphor-icons/react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  useCustomsOffices,
  useCustomsPatents,
  useCreateCustomsEntry,
} from '@/features/customs-entries/hooks/use-customs-entries';

const ENTRY_KEYS = [
  { value: 'A1', label: 'A1 — Importación definitiva' },
  { value: 'A2', label: 'A2 — Exportación definitiva' },
  { value: 'IN', label: 'IN — Importación temporal IMMEX' },
  { value: 'RT', label: 'RT — Retorno de importación temporal' },
  { value: 'V1', label: 'V1 — Depósito fiscal' },
  { value: 'G1', label: 'G1 — Tránsito interno' },
  { value: 'H1', label: 'H1 — Tránsito internacional' },
  { value: 'K1', label: 'K1 — Extracción de depósito fiscal' },
];

const REGIMES = [
  { value: 'IMP_DEFINITIVA', label: 'Importación definitiva' },
  { value: 'EXP_DEFINITIVA', label: 'Exportación definitiva' },
  { value: 'IMP_TEMPORAL', label: 'Importación temporal' },
  { value: 'EXP_TEMPORAL', label: 'Exportación temporal' },
  { value: 'DEPOSITO_FISCAL', label: 'Depósito fiscal' },
  { value: 'TRANSITO_INTERNO', label: 'Tránsito interno' },
  { value: 'TRANSITO_INTERNACIONAL', label: 'Tránsito internacional' },
  { value: 'VIRTUAL', label: 'Virtual (IMMEX)' },
];

const CURRENCIES = ['USD', 'EUR', 'MXN', 'JPY', 'GBP', 'CAD', 'CHF', 'CNY'];

export default function NuevoPedimentoPage() {
  const router = useRouter();
  const { data: offices = [] } = useCustomsOffices();
  const { data: patents = [] } = useCustomsPatents();
  const createEntry = useCreateCustomsEntry();

  const [form, setForm] = useState({
    customsOfficeId: '',
    patentId: '',
    entryKey: '',
    regime: '',
    operationType: 1,
    invoiceCurrency: 'USD',
    internalReference: '',
    observations: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.customsOfficeId || !form.patentId || !form.entryKey || !form.regime) {
      return;
    }

    const entry = await createEntry.mutateAsync({
      customsOfficeId: form.customsOfficeId,
      patentId: form.patentId,
      entryKey: form.entryKey,
      regime: form.regime,
      operationType: form.operationType,
      invoiceCurrency: form.invoiceCurrency,
      internalReference: form.internalReference || undefined,
      observations: form.observations || undefined,
    });

    router.push(`/dashboard/pedimentos/${entry.id}`);
  };

  const set = (field: keyof typeof form, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/dashboard/pedimentos">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Nuevo pedimento
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Crea el borrador de un pedimento aduanal
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos básicos</CardTitle>
            <CardDescription>
              Información requerida para crear el pedimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Aduana *</Label>
                <Select
                  value={form.customsOfficeId}
                  onValueChange={(v) => set('customsOfficeId', v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona aduana" />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map((office) => (
                      <SelectItem key={office.id} value={office.id}>
                        {office.code} — {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Patente *</Label>
                <Select
                  value={form.patentId}
                  onValueChange={(v) => set('patentId', v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona patente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patents.map((patent) => (
                      <SelectItem key={patent.id} value={patent.id}>
                        {patent.patentNumber} — {patent.holderName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Clave de pedimento *</Label>
                <Select
                  value={form.entryKey}
                  onValueChange={(v) => set('entryKey', v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona clave" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTRY_KEYS.map((k) => (
                      <SelectItem key={k.value} value={k.value}>
                        {k.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Régimen aduanero *</Label>
                <Select
                  value={form.regime}
                  onValueChange={(v) => set('regime', v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona régimen" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIMES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de operación *</Label>
                <Select
                  value={String(form.operationType)}
                  onValueChange={(v) => set('operationType', parseInt(v, 10))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 — Importación</SelectItem>
                    <SelectItem value="2">2 — Exportación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Moneda de factura</Label>
                <Select
                  value={form.invoiceCurrency}
                  onValueChange={(v) => set('invoiceCurrency', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Referencia interna</CardTitle>
            <CardDescription>
              Información de control interno de la agencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Referencia interna</Label>
              <Input
                value={form.internalReference}
                onChange={(e) => set('internalReference', e.target.value)}
                placeholder="Ej. IMP-2024-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                value={form.observations}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set('observations', e.target.value)}
                placeholder="Notas adicionales del pedimento..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/pedimentos">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={createEntry.isPending}
          >
            {createEntry.isPending ? 'Creando...' : 'Crear pedimento'}
          </Button>
        </div>
      </form>
    </div>
  );
}
