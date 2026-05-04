'use client';

import { useState } from 'react';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useOrgStore } from '@/store/org.store';
import {
  useCustomsPatents, useCreateCustomsPatent,
  useUpdateCustomsPatent, useDeleteCustomsPatent,
} from '@/features/customs-patents/hooks/use-customs-patents';
import type { CustomsPatent } from '@/features/customs-patents/types/customs-patent.types';

interface PatentForm { patentNumber: string; brokerName: string; }

function PatentDialog({
  open, onOpenChange, initial, onSave, isLoading, t,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: PatentForm;
  onSave: (form: PatentForm) => void;
  isLoading: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const [form, setForm] = useState<PatentForm>(initial);
  const handleOpen = (v: boolean) => { if (v) setForm(initial); onOpenChange(v); };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{initial.patentNumber ? t('dialogEdit') : t('dialogCreate')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">{t('fieldNumber')}</label>
            <Input className="mt-1" placeholder="3420" maxLength={4}
              value={form.patentNumber}
              onChange={(e) => setForm((f) => ({ ...f, patentNumber: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">{t('fieldBroker')}</label>
            <Input className="mt-1"
              value={form.brokerName}
              onChange={(e) => setForm((f) => ({ ...f, brokerName: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
          <Button onClick={() => onSave(form)} disabled={isLoading || !form.patentNumber.trim() || !form.brokerName.trim()}>
            {isLoading ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PatentesPage() {
  const t = useTranslations('customsPatents');
  const { activeOrgId } = useOrgStore();
  const { data: patents, isLoading } = useCustomsPatents();
  const createMutation = useCreateCustomsPatent();
  const deleteMutation = useDeleteCustomsPatent();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPatent, setEditingPatent] = useState<CustomsPatent | null>(null);
  const EditMutation = useUpdateCustomsPatent(editingPatent?.id ?? '');

  if (!activeOrgId) {
    return <div className="w-full text-sm text-muted-foreground">{t('selectOrg')}</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={14} />{t('new')}
        </Button>
      </div>

      {isLoading && <div className="h-40 rounded-lg border bg-muted/20 animate-pulse" />}

      {!isLoading && (!patents || patents.length === 0) && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm font-medium">{t('empty')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('emptyHint')}</p>
          <Button size="sm" className="mt-4" onClick={() => setCreateOpen(true)}>{t('new')}</Button>
        </div>
      )}

      {!isLoading && patents && patents.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('colNumber')}</TableHead>
                <TableHead>{t('colBroker')}</TableHead>
                <TableHead>{t('colDate')}</TableHead>
                <TableHead className="text-right">{t('colActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patents.map((patent) => (
                <TableRow key={patent.id}>
                  <TableCell className="font-mono text-sm font-semibold">{patent.patentNumber}</TableCell>
                  <TableCell className="text-sm">{patent.brokerName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(patent.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingPatent(patent)}>
                        <PencilSimple size={15} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash size={15} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('confirmDeleteDesc', { number: patent.patentNumber })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteMutation.mutate(patent.id)}
                            >
                              {t('delete')}
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
        open={createOpen} onOpenChange={setCreateOpen}
        initial={{ patentNumber: '', brokerName: '' }}
        onSave={(form) => createMutation.mutate(form, { onSuccess: () => setCreateOpen(false) })}
        isLoading={createMutation.isPending} t={t}
      />
      <PatentDialog
        open={!!editingPatent} onOpenChange={(v) => !v && setEditingPatent(null)}
        initial={editingPatent ? { patentNumber: editingPatent.patentNumber, brokerName: editingPatent.brokerName } : { patentNumber: '', brokerName: '' }}
        onSave={(form) => EditMutation.mutate(form, { onSuccess: () => setEditingPatent(null) })}
        isLoading={EditMutation.isPending} t={t}
      />
    </div>
  );
}
