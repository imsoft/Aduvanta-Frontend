'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/loading-skeletons';
import {
  useDocumentCategories,
  useCreateDocumentCategory,
  useUpdateDocumentCategory,
  useRemoveDocumentCategory,
} from '@/features/document-categories/hooks/use-document-categories';
import { useCanManage } from '@/hooks/use-permissions';
import type { DocumentCategory } from '@/features/document-categories/types/document-category.types';
import type {
  CreateDocumentCategoryFormData,
  UpdateDocumentCategoryFormData,
} from '@/features/document-categories/schemas/document-category.schemas';

export default function DocumentCategoriesPage() {
  const t = useTranslations();
  const canManage = useCanManage();

  const { data: categories = [], isLoading } = useDocumentCategories();
  const createCategory = useCreateDocumentCategory();
  const removeCategory = useRemoveDocumentCategory();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DocumentCategory | null>(null);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('docCategories.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('docCategories.description')}
          </p>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus size={14} />
            {t('docCategories.new')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={canManage ? 4 : 3} />
      ) : categories.length === 0 ? (
        <EmptyState title={t('docCategories.empty')} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('docCategories.code')}</TableHead>
              <TableHead>{t('docCategories.name')}</TableHead>
              <TableHead>{t('docCategories.descriptionField')}</TableHead>
              {canManage && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-mono text-xs">{cat.code}</TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {cat.description ?? '—'}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditTarget(cat)}
                      >
                        <PencilSimple size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                          >
                            <Trash size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('docCategories.removeTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('docCategories.removeDescription', { code: cat.code, name: cat.name })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeCategory.mutate(cat.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t('common.remove')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {canManage && (
        <>
          <CreateCategoryDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            onSubmit={(dto) =>
              createCategory.mutate(dto, { onSuccess: () => setCreateOpen(false) })
            }
            isPending={createCategory.isPending}
            t={t}
          />
          {editTarget && (
            <EditCategoryDialog
              open={!!editTarget}
              onOpenChange={(v) => !v && setEditTarget(null)}
              category={editTarget}
              onClose={() => setEditTarget(null)}
              t={t}
            />
          )}
        </>
      )}
    </div>
  );
}

function CreateCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  t,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (dto: CreateDocumentCategoryFormData) => void;
  isPending: boolean;
  t: (key: string, params?: Record<string, string>) => string;
}) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  function handleOpenChange(v: boolean) {
    if (!v) {
      setName('');
      setCode('');
      setDescription('');
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('docCategories.new')}</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-4">
          <Field label={t('docCategories.codeRequired')}>
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-muted-foreground">{t('docCategories.codeHint')}</p>
          </Field>
          <Field label={t('docCategories.nameRequired')}>
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label={t('docCategories.descriptionField')}>
            <textarea
              rows={2}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() =>
              onSubmit({
                code,
                name,
                description: description.trim() || undefined,
              })
            }
            disabled={!code.trim() || !name.trim() || isPending}
          >
            {isPending ? t('common.creating') : t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onClose,
  t,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category: DocumentCategory;
  onClose: () => void;
  t: (key: string, params?: Record<string, string>) => string;
}) {
  const updateCategory = useUpdateDocumentCategory(category.id);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('docCategories.editTitle')}</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-4">
          <Field label={t('docCategories.code')}>
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm font-mono shadow-xs text-muted-foreground"
              value={category.code}
              disabled
            />
          </Field>
          <Field label={t('docCategories.name')}>
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label={t('docCategories.descriptionField')}>
            <textarea
              rows={2}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={updateCategory.isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() =>
              updateCategory.mutate(
                {
                  name: name.trim(),
                  description: description.trim() || undefined,
                },
                { onSuccess: onClose },
              )
            }
            disabled={!name.trim() || updateCategory.isPending}
          >
            {updateCategory.isPending ? t('common.saving') : t('common.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
