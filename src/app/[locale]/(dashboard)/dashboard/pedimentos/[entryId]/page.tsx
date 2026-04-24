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
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  VIRTUAL: 'Virtual (IMMEX)',
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

const formatMXN = (v: string | null) =>
  v
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
        parseFloat(v),
      )
    : '—';

const formatUSD = (v: string | null) =>
  v
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        parseFloat(v),
      )
    : '—';

export default function PedimentoDetailPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
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

  const handleStatusChange = async () => {
    if (!selectedStatus) return;
    await changeStatus.mutateAsync({
      status: selectedStatus,
      comment: statusComment || undefined,
    });
    setStatusDialogOpen(false);
    setSelectedStatus('');
    setStatusComment('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/dashboard/pedimentos">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight font-mono">
                {entry.entryNumber ?? 'Sin número'}
              </h1>
              <EntryStatusBadge status={entry.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {entry.internalReference && (
                <span className="mr-3">Ref: {entry.internalReference}</span>
              )}
              Clave {entry.entryKey} ·{' '}
              {REGIME_LABELS[entry.regime] ?? entry.regime}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* SAAI Generate */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateSaai.mutate()}
            disabled={generateSaai.isPending}
          >
            <Download size={14} className="mr-1.5" />
            Layout SAAI
          </Button>

          {/* Status change */}
          {availableTransitions.length > 0 && (
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Cambiar estado</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar estado del pedimento</DialogTitle>
                  <DialogDescription>
                    Estado actual:{' '}
                    <strong>{STATUS_LABELS[entry.status]}</strong>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Nuevo estado</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTransitions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </SelectItem>
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
                  <Button
                    variant="outline"
                    onClick={() => setStatusDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleStatusChange}
                    disabled={!selectedStatus || changeStatus.isPending}
                  >
                    {changeStatus.isPending ? 'Guardando...' : 'Confirmar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* SAAI Validation alert */}
      {saaiValidation && !saaiValidation.valid && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex gap-3">
          <Warning size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Validación SAAI: {saaiValidation.errors.length} error(es)
            </p>
            <ul className="mt-1 text-xs text-yellow-700 list-disc list-inside space-y-0.5">
              {saaiValidation.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {saaiValidation?.valid && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 flex gap-2 items-center">
          <CheckCircle size={16} className="text-green-600" />
          <p className="text-sm text-green-800">
            Pedimento válido para transmisión SAAI
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos generales */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText size={16} />
              Datos del pedimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Aduana</dt>
                <dd className="font-medium">{entry.customsOfficeId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tipo de operación</dt>
                <dd className="font-medium">
                  {entry.operationType === 1 ? 'Importación' : 'Exportación'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">País de origen</dt>
                <dd className="font-medium">{entry.originCountry ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">País de destino</dt>
                <dd className="font-medium">
                  {entry.destinationCountry ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Transporte</dt>
                <dd className="font-medium">
                  {entry.transportMode
                    ? TRANSPORT_MODES[entry.transportMode]
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Transportista</dt>
                <dd className="font-medium">{entry.carrierName ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Doc. de transporte</dt>
                <dd className="font-medium font-mono text-xs">
                  {entry.transportDocumentNumber ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Moneda</dt>
                <dd className="font-medium">{entry.invoiceCurrency ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tipo de cambio</dt>
                <dd className="font-mono font-medium">
                  {entry.exchangeRate
                    ? parseFloat(entry.exchangeRate).toFixed(4)
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fecha de entrada</dt>
                <dd className="font-medium">
                  {entry.entryDate
                    ? new Date(entry.entryDate).toLocaleDateString('es-MX')
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fecha de pago</dt>
                <dd className="font-medium">
                  {entry.paymentDate
                    ? new Date(entry.paymentDate).toLocaleDateString('es-MX')
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Referencia de pago</dt>
                <dd className="font-mono text-xs font-medium">
                  {entry.paymentReference ?? '—'}
                </dd>
              </div>
            </dl>

            {entry.observations && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-1">
                  Observaciones
                </p>
                <p className="text-sm">{entry.observations}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Totales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Totales del pedimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor comercial USD</span>
              <span className="font-mono font-medium">
                {formatUSD(entry.totalCommercialValueUsd)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor en aduana MXN</span>
              <span className="font-mono font-medium">
                {formatMXN(entry.totalCustomsValueMxn)}
              </span>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IGI / Arancel</span>
                <span className="font-mono">{formatMXN(entry.totalDuties)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA</span>
                <span className="font-mono">{formatMXN(entry.totalVat)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">DTA</span>
                <span className="font-mono">{formatMXN(entry.totalDta)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Otros</span>
                <span className="font-mono">
                  {formatMXN(entry.totalOtherTaxes)}
                </span>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total a pagar</span>
                <span className="font-mono text-base">
                  {formatMXN(entry.grandTotal)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partidas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package size={16} />
              Partidas ({entry.items?.length ?? 0})
            </CardTitle>
            <CardDescription>Mercancías declaradas en el pedimento</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Agregar partida
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {!entry.items || entry.items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay partidas registradas. Agrega las mercancías del pedimento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Fracción</TableHead>
                    <TableHead className="max-w-56">Descripción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Valor USD</TableHead>
                    <TableHead>Valor aduana MXN</TableHead>
                    <TableHead>País origen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entry.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-muted-foreground">
                        {item.sequenceNumber}
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {item.tariffFraction ?? '—'}
                      </TableCell>
                      <TableCell className="max-w-56 truncate text-sm">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.quantity
                          ? `${parseFloat(item.quantity).toLocaleString('es-MX')} ${item.unitOfMeasure ?? ''}`
                          : '—'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatUSD(item.commercialValueUsd)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatMXN(item.customsValueMxn)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.countryOfOrigin ?? '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users size={16} />
            Partes involucradas ({entry.parties?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!entry.parties || entry.parties.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay partes registradas.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entry.parties.map((party) => (
                <div key={party.id} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {party.partyType}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {party.taxId ?? '—'}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{party.name}</p>
                  {party.address && (
                    <p className="text-xs text-muted-foreground">
                      {party.address}
                    </p>
                  )}
                  {party.country && (
                    <p className="text-xs text-muted-foreground">
                      {party.country}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentos soporte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ClipboardText size={16} />
            Documentos soporte ({entry.documents?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!entry.documents || entry.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay documentos registrados.
            </p>
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
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entry.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-mono font-medium">
                        {doc.documentType}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {doc.documentNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        {doc.documentDate
                          ? new Date(doc.documentDate).toLocaleDateString('es-MX')
                          : '—'}
                      </TableCell>
                      <TableCell>{doc.countryCode ?? '—'}</TableCell>
                      <TableCell>{doc.currency ?? '—'}</TableCell>
                      <TableCell className="font-mono text-sm">
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
        </CardContent>
      </Card>
    </div>
  );
}
