'use client';

import { useState } from 'react';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useOrgStore } from '@/store/org.store';
import {
  useCustomsPatents,
  useCreateCustomsPatent,
  useUpdateCustomsPatent,
  useDeleteCustomsPatent,
} from '@/features/customs-patents/hooks/use-customs-patents';
import type { CustomsPatent } from '@/features/customs-patents/types/customs-patent.types';

interface PatentForm {
  patentNumber: string;
  brokerName: string;
}

function PatentDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: PatentForm;
  onSave: (form: PatentForm) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<PatentForm>(initial);

  const handleOpen = (v: boolean) => {
    if (v) setForm(initial);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {initial.patentNumber ? 'Editar patente' : 'Nueva patente'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">Número de patente</label>
            <Input
              className="mt-1"
              placeholder="3420"
              maxLength={4}
              value={form.patentNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, patentNumber: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nombre del agente aduanal</label>
            <Input
              className="mt-1"
              placeholder="Nombre del agente"
              value={form.brokerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, brokerName: e.target.value }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={
              isLoading ||
              !form.patentNumber.trim() ||
              !form.brokerName.trim()
            }
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PatentesPage() {
  const { activeOrgId } = useOrgStore();
  const { data: patents, isLoading } = useCustomsPatents();
  const createMutation = useCreateCustomsPatent();
  const deleteMutation = useDeleteCustomsPatent();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPatent, setEditingPatent] = useState<CustomsPatent | null>(null);

  const EditMutation = useUpdateCustomsPatent(editingPatent?.id ?? '');

  const handleCreate = (form: PatentForm) => {
    createMutation.mutate(form, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleUpdate = (form: PatentForm) => {
    if (!editingPatent) return;
    EditMutation.mutate(form, {
      onSuccess: () => setEditingPatent(null),
    });
  };

  if (!activeOrgId) {
    return (
      <div className="w-full text-sm text-muted-foreground">
        Selecciona una organización para ver las patentes.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Patentes Aduanales
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra las patentes de agente aduanal de tu organización
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={14} />
          Nueva patente
        </Button>
      </div>

      {isLoading && (
        <div className="h-40 rounded-lg border bg-muted/20 animate-pulse" />
      )}

      {!isLoading && (!patents || patents.length === 0) && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm font-medium">No hay patentes registradas</p>
          <p className="text-sm text-muted-foreground mt-1">
            Agrega la primera patente aduanal de tu organización
          </p>
          <Button size="sm" className="mt-4" onClick={() => setCreateOpen(true)}>
            Nueva patente
          </Button>
        </div>
      )}

      {!isLoading && patents && patents.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Agente Aduanal</TableHead>
                <TableHead>Fecha de registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patents.map((patent) => (
                <TableRow key={patent.id}>
                  <TableCell className="font-mono text-sm font-semibold">
                    {patent.patentNumber}
                  </TableCell>
                  <TableCell className="text-sm">{patent.brokerName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(patent.createdAt).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingPatent(patent)}
                      >
                        <PencilSimple size={15} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash size={15} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar patente</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Confirmas que quieres eliminar la patente{' '}
                              <strong>{patent.patentNumber}</strong>? Esta acción
                              no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteMutation.mutate(patent.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PatentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={{ patentNumber: '', brokerName: '' }}
        onSave={handleCreate}
        isLoading={createMutation.isPending}
      />

      <PatentDialog
        open={!!editingPatent}
        onOpenChange={(v) => !v && setEditingPatent(null)}
        initial={
          editingPatent
            ? {
                patentNumber: editingPatent.patentNumber,
                brokerName: editingPatent.brokerName,
              }
            : { patentNumber: '', brokerName: '' }
        }
        onSave={handleUpdate}
        isLoading={EditMutation.isPending}
      />
    </div>
  );
}
