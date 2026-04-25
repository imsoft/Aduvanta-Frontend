'use client';

import React, { use, useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft,
  FileText,
  Package,
  Users,
  ClipboardText,
  Download,
  CheckCircle,
  Warning,
  Truck,
  Scales,
  Tag,
  Cube,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EntryStatusBadge } from '@/components/customs-entries/entry-status-badge';
import {
  useCustomsEntry,
  useChangeEntryStatus,
  useGenerateSaaiLayout,
  useValidateSaai,
} from '@/features/customs-entries/hooks/use-customs-entries';
import type { EntryStatus } from '@/features/customs-entries/types/customs-entry.types';

const STATUS_TRANSITIONS: Record<EntryStatus, EntryStatus[]> = {
  DRAFT: ['PREVALIDATED', 'CANCELLED'],
  PREVALIDATED: ['VALIDATED', 'DRAFT', 'CANCELLED'],
  VALIDATED: ['PAID', 'CANCELLED'],
  PAID: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['RELEASED', 'CANCELLED'],
  RELEASED: ['RECTIFIED'],
  CANCELLED: [],
  RECTIFIED: [],
};

const STATUS_LABELS: Record<EntryStatus, string> = {
  DRAFT: 'Borrador',
  PREVALIDATED: 'Prevalidado',
  VALIDATED: 'Validado',
  PAID: 'Pagado',
  DISPATCHED: 'Modulado',
  RELEASED: 'Liberado',
  CANCELLED: 'Cancelado',
  RECTIFIED: 'Rectificado',
};

const REGIME_LABELS: Record<string, string> = {
  IMP_DEFINITIVA: 'A1 — Importación definitiva',
  EXP_DEFINITIVA: 'A2 — Exportación definitiva',
  IMP_TEMPORAL: 'Importación temporal',
  EXP_TEMPORAL: 'Exportación temporal',
  DEPOSITO_FISCAL: 'Depósito fiscal',
  TRANSITO_INTERNO: 'Tránsito interno',
  TRANSITO_INTERNACIONAL: 'Tránsito internacional',
  ELABORACION_TRANSFORMACION: 'Elaboración/transformación en recinto',
  REEXPEDICION: 'Reexpedición',
  RETORNO: 'Retorno',
  REGULARIZACION: 'Regularización',
  CAMBIO_REGIMEN: 'Cambio de régimen',
  EXTRACCION_DEPOSITO: 'Extracción de depósito fiscal',
  VIRTUAL: 'Virtual (IMMEX)',
  OTHER: 'Otro',
};

const TRANSPORT_MODES: Record<number, string> = {
  1: 'Aéreo',
  2: 'Marítimo',
  3: 'Terrestre',
  4: 'Ferroviario',
  5: 'Carretero',
  6: 'Ducto',
  7: 'Postal',
};

const VALUATION_METHODS: Record<number, string> = {
  1: '1 — Valor de transacción',
  2: '2 — Mercancías idénticas',
  3: '3 — Mercancías similares',
  4: '4 — Valor deductivo',
  5: '5 — Valor reconstruido',
  6: '6 — Último recurso',
  7: '7 — Precio estimado',
};

const formatMXN = (v: string | null | undefined) =>
  v
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseFloat(v))
    : '—';

const formatUSD = (v: string | null | undefined) =>
  v
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(v))
    : '—';

const fmt = (v: string | number | null | undefined, decimals = 2) =>
  v != null ? parseFloat(String(v)).toLocaleString('es-MX', { minimumFractionDigits: decimals }) : '—';

const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

// Reusable block component matching the SAT ledger-style layout
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-muted/30 px-4 py-2 border-b">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({ label, value, mono = false, className = '' }: { label: string; value: React.ReactNode; mono?: boolean; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
    </div>
  );
}

export default function PedimentoDetailPage({ params }: { params: Promise<{ entryId: string }> }) {
  const { entryId } = use(params);
  const { data: entry, isLoading } = useCustomsEntry(entryId);
  const { data: saaiValidation } = useValidateSaai(entryId);
  const changeStatus = useChangeEntryStatus(entryId);
  const generateSaai = useGenerateSaaiLayout(entryId);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="w-full text-center py-20 text-muted-foreground">
        Pedimento no encontrado.
      </div>
    );
  }

  const availableTransitions = STATUS_TRANSITIONS[entry.status] ?? [];
  const importer = entry.parties?.find((p) => p.role === 'IMPORTER' || p.role === 'EXPORTER');
  const seller = entry.parties?.find((p) => p.role === 'SELLER');
  const broker = entry.parties?.find((p) => p.role === 'CUSTOMS_BROKER');
  const pedimentoIdentifiers = entry.identifiers?.filter((i) => i.level === 'PEDIMENTO') ?? [];

  const handleStatusChange = async () => {
    if (!selectedStatus) return;
    await changeStatus.mutateAsync({ status: selectedStatus, comment: statusComment || undefined });
    setStatusDialogOpen(false);
    setSelectedStatus('');
    setStatusComment('');
  };

  return (
    <div className="w-full space-y-5">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/dashboard/pedimentos">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold tracking-tight font-mono">
                {entry.entryNumber ?? 'Sin número asignado'}
              </h1>
              <EntryStatusBadge status={entry.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {entry.internalReference && <span className="mr-3">Ref: {entry.internalReference}</span>}
              Cve. {entry.entryKey} · {REGIME_LABELS[entry.regime] ?? entry.regime}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => generateSaai.mutate()} disabled={generateSaai.isPending}>
            <Download size={14} className="mr-1.5" />
            Layout SAAI
          </Button>
          {availableTransitions.length > 0 && (
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Cambiar estado</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar estado del pedimento</DialogTitle>
                  <DialogDescription>Estado actual: <strong>{STATUS_LABELS[entry.status]}</strong></DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Nuevo estado</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger><SelectValue placeholder="Selecciona estado" /></SelectTrigger>
                      <SelectContent>
                        {availableTransitions.map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Comentario (opcional)</Label>
                    <Textarea
                      value={statusComment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStatusComment(e.target.value)}
                      placeholder="Motivo del cambio de estado..."
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleStatusChange} disabled={!selectedStatus || changeStatus.isPending}>
                    {changeStatus.isPending ? 'Guardando...' : 'Confirmar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* ── SAAI validation alerts ── */}
      {saaiValidation && !saaiValidation.valid && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900 p-4 flex gap-3">
          <Warning size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Validación SAAI — {saaiValidation.errors.length} error(es)
            </p>
            <ul className="mt-1 text-xs text-yellow-700 dark:text-yellow-400 list-disc list-inside space-y-0.5">
              {saaiValidation.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        </div>
      )}
      {saaiValidation?.valid && (
        <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-3 flex gap-2 items-center">
          <CheckCircle size={16} className="text-green-600" />
          <p className="text-sm text-green-800 dark:text-green-300">Pedimento válido para transmisión SAAI</p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 1 — ENCABEZADO PRINCIPAL DEL PEDIMENTO
      ══════════════════════════════════════════════════════════════ */}
      <Block title="Encabezado principal del pedimento">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          <Field label="Núm. Pedimento" value={<span className="font-mono">{entry.entryNumber ?? '—'}</span>} />
          <Field label="T. Oper" value={entry.operationType === 1 ? '1 — Importación' : '2 — Exportación'} />
          <Field label="Cve. Pedimento" value={<span className="font-mono">{entry.entryKey}</span>} />
          <Field label="Régimen" value={REGIME_LABELS[entry.regime] ?? entry.regime} />
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          <Field label="Aduana E/S" value={entry.customsOfficeId} mono />
          <Field label="Tipo de Cambio" value={entry.exchangeRate ? `$${parseFloat(entry.exchangeRate).toFixed(4)}` : '—'} mono />
          <Field label="Peso Bruto (kg)" value={entry.grossWeightKg ? fmt(entry.grossWeightKg, 4) : '—'} mono />
          <Field label="Total de Bultos" value={entry.packageCount?.toLocaleString('es-MX') ?? '—'} mono />
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          <Field label="Valor Dólares" value={formatUSD(entry.totalCommercialValueUsd)} mono />
          <Field label="Valor en Aduana (MXN)" value={formatMXN(entry.totalCustomsValueMxn)} mono />
          <Field label="Precio Pagado / Val. Comercial" value={formatUSD(entry.totalCommercialValueUsd)} mono />
          <Field label="INCOTERM" value={entry.incoterm ?? '—'} />
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          <Field label="Fecha de Entrada" value={fmtDate(entry.entryDate)} />
          <Field label="Fecha de Arribo" value={fmtDate(entry.arrivalDate)} />
          <Field label="Fecha de Salida" value={fmtDate(entry.exitDate)} />
          <Field label="Fecha de Pago" value={fmtDate(entry.paymentDate)} />
        </div>
        {entry.packageMarks && (
          <>
            <Separator className="my-4" />
            <Field label="Marcas, Números y Total de Bultos" value={entry.packageMarks} />
          </>
        )}
        {(entry.acceptanceCode || entry.customsSectionKey) && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              {entry.acceptanceCode && <Field label="Código de Aceptación" value={entry.acceptanceCode} mono />}
              {entry.customsSectionKey && <Field label="Clave de Sección Aduanera" value={entry.customsSectionKey} mono />}
            </div>
          </>
        )}
      </Block>

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 2 — DATOS DEL IMPORTADOR / EXPORTADOR
      ══════════════════════════════════════════════════════════════ */}
      {importer && (
        <Block title="Datos del Importador / Exportador">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="RFC" value={importer.taxId} mono />
            <Field label="CURP" value={importer.curp} mono />
            <Field label="Nombre / Razón Social" value={importer.name} className="sm:col-span-2" />
            {importer.address && <Field label="Domicilio" value={importer.address} className="sm:col-span-2" />}
          </div>
        </Block>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 3 — DATOS DEL PROVEEDOR / COMPRADOR (COVE)
      ══════════════════════════════════════════════════════════════ */}
      {(seller || entry.valueReceiptNumber || entry.vinculacion) && (
        <Block title="Datos del Proveedor o Comprador">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
            {entry.valueReceiptNumber && (
              <Field label="Núm. Acuse de Valor (COVE)" value={entry.valueReceiptNumber} mono className="sm:col-span-2" />
            )}
            <Field label="Vinculación" value={entry.vinculacion === 'S' ? 'Sí (S)' : entry.vinculacion === 'N' ? 'No (N)' : '—'} />
            <Field label="INCOTERM" value={entry.incoterm ?? '—'} />
          </div>
          {seller && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Nombre / Razón Social del Proveedor" value={seller.name} />
                <Field label="RFC / Tax ID" value={seller.taxId} mono />
                {seller.address && <Field label="Domicilio / Ciudad / Estado" value={seller.address} className="sm:col-span-2" />}
              </div>
            </>
          )}
        </Block>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 4 — INCREMENTABLES
      ══════════════════════════════════════════════════════════════ */}
      {(entry.freightValue || entry.insuranceValue || entry.packagingValue || entry.otherIncrementables) && (
        <Block title="Incrementables (Art. 65-66 Ley Aduanera)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Val. Seguros" value={formatUSD(entry.insuranceValue)} mono />
            <Field label="Seguros" value={formatUSD(entry.insuranceValue)} mono />
            <Field label="Fletes" value={formatUSD(entry.freightValue)} mono />
            <Field label="Embalajes" value={formatUSD(entry.packagingValue)} mono />
            <Field label="Otros Incrementables" value={formatUSD(entry.otherIncrementables)} mono />
          </div>
        </Block>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 5 — DATOS DEL TRANSPORTE Y TRANSPORTISTA
      ══════════════════════════════════════════════════════════════ */}
      <Block title="Datos del Transporte y Transportista">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          <Field
            label="Medio de Transporte (Entrada/Salida)"
            value={entry.transportMode ? TRANSPORT_MODES[entry.transportMode] : '—'}
          />
          <Field label="País de Origen / Procedencia" value={entry.originCountry ?? '—'} />
          <Field label="País de Destino" value={entry.destinationCountry ?? '—'} />
          <Field label="Transportista" value={entry.carrierName ?? '—'} />
        </div>
        {entry.transportDocumentNumber && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Guía / Manifiesto / Conocimiento de Embarque" value={entry.transportDocumentNumber} mono />
            </div>
          </>
        )}
        {broker && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="Agente Aduanal (Nombre / Razón Social)" value={broker.name} />
              <Field label="RFC" value={broker.taxId} mono />
              <Field label="CURP" value={broker.curp} mono />
            </div>
          </>
        )}
      </Block>

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 6 — CONTENEDORES / EQUIPO
      ══════════════════════════════════════════════════════════════ */}
      {entry.containers && entry.containers.length > 0 && (
        <Block title="Contenedores / Carro de Ferrocarril / Número Económico del Vehículo">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.containers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono">{c.number}</TableCell>
                    <TableCell>{c.containerType ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Block>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 7 — IDENTIFICADORES (NIVEL PEDIMENTO)
      ══════════════════════════════════════════════════════════════ */}
      {pedimentoIdentifiers.length > 0 && (
        <Block title="Identificadores (Nivel Pedimento)">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clave / Compl.</TableHead>
                  <TableHead>Complemento 1</TableHead>
                  <TableHead>Complemento 2</TableHead>
                  <TableHead>Complemento 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedimentoIdentifiers.map((id) => (
                  <TableRow key={id.id}>
                    <TableCell className="font-mono font-medium">{id.code}</TableCell>
                    <TableCell>{id.complement1 ?? '—'}</TableCell>
                    <TableCell>{id.complement2 ?? '—'}</TableCell>
                    <TableCell>{id.complement3 ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Block>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 8 — CUADRO DE LIQUIDACIÓN
      ══════════════════════════════════════════════════════════════ */}
      <Block title="Cuadro de Liquidación">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IGI / Arancel (DBA)</span>
              <span className="font-mono font-medium">{formatMXN(entry.totalDuties)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA</span>
              <span className="font-mono font-medium">{formatMXN(entry.totalVat)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">DTA (Derecho de Trámite Aduanero)</span>
              <span className="font-mono font-medium">{formatMXN(entry.totalDta)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Otros contribuciones</span>
              <span className="font-mono font-medium">{formatMXN(entry.totalOtherTaxes)}</span>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/10 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Efectivo</span>
              <span className="font-mono">{formatMXN(entry.grandTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Otros (complementarios)</span>
              <span className="font-mono">—</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>TOTAL</span>
              <span className="font-mono text-base">{formatMXN(entry.grandTotal)}</span>
            </div>
            {entry.paymentReference && (
              <p className="text-xs text-muted-foreground font-mono">Ref. pago: {entry.paymentReference}</p>
            )}
          </div>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 9 — PARTIDAS
      ══════════════════════════════════════════════════════════════ */}
      <div className="rounded-lg border overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Package size={13} />
            Partidas ({entry.items?.length ?? 0})
          </p>
          <Button variant="outline" size="sm">Agregar partida</Button>
        </div>

        {!entry.items || entry.items.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No hay partidas registradas. Agrega las mercancías del pedimento.
          </div>
        ) : (
          <div className="divide-y">
            {entry.items.map((item) => {
              const itemIdentifiers = entry.identifiers?.filter(
                (i) => i.level === 'PARTIDA' && i.itemId === item.id,
              ) ?? [];

              return (
                <div key={item.id} className="p-4 space-y-3">
                  {/* Item header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-bold text-muted-foreground bg-muted rounded px-2 py-0.5 shrink-0">
                        #{item.itemNumber}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.tariffFractionCode && (
                            <span className="font-mono mr-2">{item.tariffFractionCode}</span>
                          )}
                          {item.tariffSubdivision && (
                            <span className="font-mono mr-2">SUBD: {item.tariffSubdivision}</span>
                          )}
                          {item.originCountry && <span>Origen: {item.originCountry}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.tradeAgreementCode && (
                        <Badge variant="secondary" className="text-xs">{item.tradeAgreementCode}</Badge>
                      )}
                      {item.valuationMethod && (
                        <Badge variant="outline" className="text-xs">
                          Met. {item.valuationMethod}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Item fields grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">UMT — Cantidad</p>
                      <p className="font-mono font-medium">
                        {item.quantity ? `${fmt(item.quantity, 4)} ${item.measurementUnit ?? ''}` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">UMC — Cantidad</p>
                      <p className="font-mono font-medium">
                        {item.commercialQuantity
                          ? `${fmt(item.commercialQuantity, 4)} ${item.commercialUnitOfMeasure ?? ''}`
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Peso Bruto (kg)</p>
                      <p className="font-mono font-medium">{item.grossWeightKg ? fmt(item.grossWeightKg, 4) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Precio Unit. USD</p>
                      <p className="font-mono font-medium">{formatUSD(item.unitPriceUsd)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Imp. Precio Pag. USD</p>
                      <p className="font-mono font-medium">{formatUSD(item.paidPriceUsd ?? item.commercialValueUsd)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Val. Aduana USD</p>
                      <p className="font-mono font-medium">{formatUSD(item.customsValueUsd)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Val. Aduana MXN</p>
                      <p className="font-mono font-medium">{formatMXN(item.customsValueMxn)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Val. Agregado MXN</p>
                      <p className="font-mono font-medium">{formatMXN(item.addedValueMxn)}</p>
                    </div>
                    {item.brand && (
                      <div>
                        <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Marca</p>
                        <p className="font-medium">{item.brand}</p>
                      </div>
                    )}
                    {item.model && (
                      <div>
                        <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Modelo</p>
                        <p className="font-medium">{item.model}</p>
                      </div>
                    )}
                    {item.serialNumber && (
                      <div>
                        <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Núm. Serie / VIN</p>
                        <p className="font-mono font-medium">{item.serialNumber}</p>
                      </div>
                    )}
                    {item.productCode && (
                      <div>
                        <p className="text-muted-foreground uppercase tracking-wide font-semibold text-[9px] mb-0.5">Código Producto</p>
                        <p className="font-mono font-medium">{item.productCode}</p>
                      </div>
                    )}
                  </div>

                  {/* Item identifiers */}
                  {itemIdentifiers.length > 0 && (
                    <div className="rounded bg-muted/30 px-3 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        Identificadores (partida)
                      </p>
                      <div className="space-y-1">
                        {itemIdentifiers.map((id) => (
                          <div key={id.id} className="flex gap-4 text-xs font-mono">
                            <span className="font-bold">{id.code}</span>
                            {id.complement1 && <span>{id.complement1}</span>}
                            {id.complement2 && <span>{id.complement2}</span>}
                            {id.complement3 && <span>{id.complement3}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.observations && (
                    <p className="text-xs text-muted-foreground italic">Obs: {item.observations}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 10 — PARTES INVOLUCRADAS
      ══════════════════════════════════════════════════════════════ */}
      {entry.parties && entry.parties.length > 0 && (
        <Block title="Partes Involucradas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entry.parties.map((party) => (
              <div key={party.id} className="rounded-lg border p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{party.role}</Badge>
                  <span className="font-mono text-xs text-muted-foreground">{party.taxId ?? '—'}</span>
                </div>
                <p className="font-medium text-sm">{party.name}</p>
                {party.curp && <p className="text-xs text-muted-foreground font-mono">CURP: {party.curp}</p>}
                {party.address && <p className="text-xs text-muted-foreground">{party.address}</p>}
                {party.country && <p className="text-xs text-muted-foreground">{party.country}</p>}
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 11 — DOCUMENTOS SOPORTE
      ══════════════════════════════════════════════════════════════ */}
      <Block title="Documentos Soporte">
        {!entry.documents || entry.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay documentos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono font-medium">{doc.documentType}</TableCell>
                    <TableCell className="font-mono text-sm">{doc.documentNumber}</TableCell>
                    <TableCell className="text-sm">{fmtDate(doc.documentDate)}</TableCell>
                    <TableCell>{doc.countryCode ?? '—'}</TableCell>
                    <TableCell>{doc.currency ?? '—'}</TableCell>
                    <TableCell className="font-mono text-sm text-right">
                      {doc.value
                        ? parseFloat(doc.value).toLocaleString('es-MX', {
                            style: 'currency',
                            currency: doc.currency ?? 'USD',
                          })
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Block>

      {/* ══════════════════════════════════════════════════════════════
          BLOQUE 12 — OBSERVACIONES
      ══════════════════════════════════════════════════════════════ */}
      {entry.observations && (
        <Block title="Observaciones">
          <p className="text-sm">{entry.observations}</p>
        </Block>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PIE — HISTORIAL DE ESTADO
      ══════════════════════════════════════════════════════════════ */}
      {entry.statusHistory && entry.statusHistory.length > 0 && (
        <Block title="Historial de estado">
          <div className="space-y-2">
            {entry.statusHistory.map((h) => (
              <div key={h.id} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground shrink-0 text-xs font-mono">
                  {fmtDate(h.createdAt)}
                </span>
                <span className="text-muted-foreground">→</span>
                <EntryStatusBadge status={h.toStatus as EntryStatus} />
                {h.comment && <span className="text-xs text-muted-foreground">{h.comment}</span>}
              </div>
            ))}
          </div>
        </Block>
      )}
    </div>
  );
}
