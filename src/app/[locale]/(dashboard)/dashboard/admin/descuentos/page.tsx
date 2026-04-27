'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Plus, PencilSimple, Trash, Tag } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type BillingOverride = {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  discountPercent: number;
  isFree: boolean;
  note: string | null;
  validUntil: string | null;
  createdAt: string;
};

type OverrideFormState = {
  organizationId: string;
  discountPercent: number;
  note: string;
  validUntil: string;
};

const EMPTY_FORM: OverrideFormState = {
  organizationId: '',
  discountPercent: 100,
  note: '',
  validUntil: '',
};

function useOverrides() {
  return useQuery({
    queryKey: ['billing-overrides'],
    queryFn: async () => {
      const { data } = await apiClient.get<BillingOverride[]>(
        '/system-admin/billing-overrides',
      );
      return data;
    },
    staleTime: 1000 * 30,
  });
}

function DiscountBadge({ override }: { override: BillingOverride }) {
  const t = useTranslations('admin.descuentos');
  const isExpired =
    override.validUntil !== null && new Date(override.validUntil) < new Date();

  if (isExpired) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        {t('statusExpired')}
      </Badge>
    );
  }

  if (override.isFree) {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
        {t('statusFree')}
      </Badge>
    );
  }

  return (
    <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
      {t('statusDiscount', { percent: override.discountPercent })}
    </Badge>
  );
}

export default function DescuentosPage() {
  const t = useTranslations('admin.descuentos');
  const queryClient = useQueryClient();

  const { data: overrides = [], isLoading } = useOverrides();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OverrideFormState>(EMPTY_FORM);

  const set = <K extends keyof OverrideFormState>(
    key: K,
    value: OverrideFormState[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const createMutation = useMutation({
    mutationFn: async (payload: object) => {
      await apiClient.post('/system-admin/billing-overrides', payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['billing-overrides'] });
      toast.success(t('created'));
      setDialogOpen(false);
      setForm(EMPTY_FORM);
    },
    onError: () => toast.error('Error'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: object }) => {
      await apiClient.put(`/system-admin/billing-overrides/${id}`, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['billing-overrides'] });
      toast.success(t('updated'));
      setDialogOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    },
    onError: () => toast.error('Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/system-admin/billing-overrides/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['billing-overrides'] });
      toast.success(t('deleted'));
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (override: BillingOverride) => {
    setEditingId(override.id);
    setForm({
      organizationId: override.organizationId,
      discountPercent: override.discountPercent,
      note: override.note ?? '',
      validUntil: override.validUntil
        ? override.validUntil.slice(0, 10)
        : '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      organizationId: form.organizationId,
      discountPercent: form.discountPercent,
      isFree: form.discountPercent === 100,
      note: form.note || undefined,
      validUntil: form.validUntil
        ? new Date(`${form.validUntil}T23:59:59Z`).toISOString()
        : undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
            <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
        </div>

        <Button size="sm" onClick={openCreate}>
          <Plus size={14} className="mr-1.5" />
          {t('newOverride')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : overrides.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Tag size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('emptyTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('emptyDescription')}</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colOrganization')}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colDiscount')}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colExpiry')}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colNote')}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {overrides.map((override) => (
                <tr key={override.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{override.organizationName}</p>
                    <p className="text-xs text-muted-foreground">{override.organizationSlug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <DiscountBadge override={override} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {override.validUntil
                      ? format(new Date(override.validUntil), 'dd MMM yyyy')
                      : t('noExpiry')}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm max-w-[200px] truncate">
                    {override.note ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEdit(override)}
                      >
                        <PencilSimple size={13} />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                          >
                            <Trash size={13} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('deleteOverride')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('confirmDelete')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteMutation.mutate(override.id)}
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t('editOverride') : t('newOverride')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {!editingId && (
              <div className="space-y-1.5">
                <Label>{t('formOrganization')}</Label>
                <Input
                  value={form.organizationId}
                  onChange={(e) => set('organizationId', e.target.value)}
                  placeholder="org-uuid"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>{t('formDiscount')}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.discountPercent}
                onChange={(e) => set('discountPercent', Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">{t('formDiscountHint')}</p>
            </div>

            <div className="space-y-1.5">
              <Label>{t('formNote')}</Label>
              <Input
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
                placeholder="e.g. Early access — founder tier"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t('formExpiry')}</Label>
              <Input
                type="date"
                value={form.validUntil}
                onChange={(e) => set('validUntil', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t('formExpiryHint')}</p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('saving') : t('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
