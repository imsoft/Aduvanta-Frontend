'use client';

import { useState } from 'react';
import {
  useAllAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from '@/features/system-admin/hooks/use-system-admin';
import type { AnnouncementRow } from '@/features/system-admin/api/system-admin.api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash, PencilSimple, BellRinging, CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';

const LEVEL_COLORS: Record<string, string> = {
  INFO: 'bg-blue-100 text-blue-700 border-blue-200',
  WARNING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
};

const LEVEL_ICONS = {
  INFO: CheckCircle,
  WARNING: WarningCircle,
  CRITICAL: XCircle,
};

const EMPTY_FORM = {
  title: '',
  body: '',
  level: 'INFO' as 'INFO' | 'WARNING' | 'CRITICAL',
  startsAt: new Date().toISOString().split('T')[0],
  endsAt: '',
};

export default function AdminAnunciosPage() {
  const { data: announcements = [], isLoading } = useAllAnnouncements();
  const create = useCreateAnnouncement();
  const update = useUpdateAnnouncement();
  const del = useDeleteAnnouncement();
  const t = useTranslations('admin');
  const locale = useLocale();
  const dateLocale = locale === 'es-MX' ? es : enUS;

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AnnouncementRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const LEVEL_LABELS = {
    INFO: t('anuncios.levelInfo'),
    WARNING: t('anuncios.levelWarning'),
    CRITICAL: t('anuncios.levelCritical'),
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setCreateOpen(true);
  };

  const openEdit = (a: AnnouncementRow) => {
    setEditTarget(a);
    setForm({
      title: a.title,
      body: a.body,
      level: a.level,
      startsAt: a.startsAt.split('T')[0],
      endsAt: a.endsAt ? a.endsAt.split('T')[0] : '',
    });
  };

  const handleCreate = async () => {
    await create.mutateAsync({
      title: form.title,
      body: form.body,
      level: form.level,
      startsAt: form.startsAt,
      endsAt: form.endsAt || undefined,
    });
    toast.success(t('anuncios.toastCreated'));
    setCreateOpen(false);
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    await update.mutateAsync({
      id: editTarget.id,
      title: form.title,
      body: form.body,
      level: form.level,
      startsAt: form.startsAt,
      endsAt: form.endsAt || null,
    });
    toast.success(t('anuncios.toastUpdated'));
    setEditTarget(null);
  };

  const handleToggleActive = async (a: AnnouncementRow) => {
    await update.mutateAsync({ id: a.id, isActive: !a.isActive });
    toast.success(a.isActive ? t('anuncios.toastDeactivated') : t('anuncios.toastActivated'));
  };

  const handleDelete = async (id: string) => {
    await del.mutateAsync(id);
    toast.success(t('anuncios.toastDeleted'));
  };

  const AnnouncementForm = (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>{t('anuncios.titleLabel')}</Label>
        <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={t('anuncios.titlePlaceholder')} />
      </div>
      <div className="space-y-2">
        <Label>{t('anuncios.bodyLabel')}</Label>
        <textarea
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder={t('anuncios.bodyPlaceholder')}
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>{t('anuncios.levelLabel')}</Label>
          <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v as typeof form.level }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('anuncios.fromLabel')}</Label>
          <Input type="date" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>{t('anuncios.toLabel')}</Label>
          <Input type="date" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{t('anuncios.title')}</h1>
            <Badge variant="destructive" className="text-[10px]">{t('common.superAdmin')}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('anuncios.description')}
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus size={14} className="mr-1.5" />
              {t('anuncios.newButton')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('anuncios.createDialogTitle')}</DialogTitle></DialogHeader>
            {AnnouncementForm}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>{t('anuncios.cancel')}</Button>
              <Button onClick={handleCreate} disabled={!form.title || !form.body || create.isPending}>
                {create.isPending ? t('anuncios.creating') : t('anuncios.create')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('anuncios.editDialogTitle')}</DialogTitle></DialogHeader>
          {AnnouncementForm}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setEditTarget(null)}>{t('anuncios.cancel')}</Button>
            <Button onClick={handleUpdate} disabled={!form.title || !form.body || update.isPending}>
              {update.isPending ? t('anuncios.saving') : t('anuncios.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border h-20 bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <BellRinging size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('anuncios.noAnnouncements')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('anuncios.noAnnouncementsDescription')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const Icon = LEVEL_ICONS[a.level] ?? CheckCircle;
            return (
              <div
                key={a.id}
                className={`rounded-xl border p-4 flex items-start gap-4 ${!a.isActive ? 'opacity-50' : ''}`}
              >
                <div className={`rounded-lg p-2 shrink-0 ${LEVEL_COLORS[a.level]}`}>
                  <Icon size={16} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <Badge variant={a.isActive ? 'secondary' : 'outline'} className="text-[10px]">
                      {a.isActive ? t('anuncios.active') : t('anuncios.inactive')}
                    </Badge>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${LEVEL_COLORS[a.level]}`}>
                      {LEVEL_LABELS[a.level]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(a.startsAt), 'dd MMM yyyy', { locale: dateLocale })}
                    {a.endsAt && ` → ${format(new Date(a.endsAt), 'dd MMM yyyy', { locale: dateLocale })}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(a)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${a.isActive ? 'bg-green-500' : 'bg-muted'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${a.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(a)}>
                    <PencilSimple size={13} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(a.id)}
                    disabled={del.isPending}
                  >
                    <Trash size={13} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
