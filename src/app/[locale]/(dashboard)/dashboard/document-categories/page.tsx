'use client';

import { useState } from 'react';
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
import {
  useDocumentCategories,
  useCreateDocumentCategory,
  useUpdateDocumentCategory,
  useRemoveDocumentCategory,
} from '@/features/document-categories/hooks/use-document-categories';
import { useOrgStore } from '@/store/org.store';
import type { DocumentCategory } from '@/features/document-categories/types/document-category.types';
import type {
  CreateDocumentCategoryFormData,
  UpdateDocumentCategoryFormData,
} from '@/features/document-categories/schemas/document-category.schemas';

export default function DocumentCategoriesPage() {
  const { organizations, activeOrgId } = useOrgStore();
  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const canManage = activeOrg?.role === 'OWNER' || activeOrg?.role === 'ADMIN';

  const { data: categories = [], isLoading } = useDocumentCategories();
  const createCategory = useCreateDocumentCategory();
  const removeCategory = useRemoveDocumentCategory();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DocumentCategory | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Document categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize documents into categories for easier retrieval.
          </p>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus size={14} />
            New category
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
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
                            <AlertDialogTitle>Remove category?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <span className="font-mono">{cat.code}</span> — {cat.name} will be
                              removed. Documents assigned to this category will not be deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeCategory.mutate(cat.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
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
          />
          {editTarget && (
            <EditCategoryDialog
              open={!!editTarget}
              onOpenChange={(v) => !v && setEditTarget(null)}
              category={editTarget}
              onClose={() => setEditTarget(null)}
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
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (dto: CreateDocumentCategoryFormData) => void;
  isPending: boolean;
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
          <DialogTitle>New category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Code *">
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring uppercase"
              placeholder="e.g. IMPORT_DEC"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-muted-foreground">Uppercase letters, digits, underscores</p>
          </Field>
          <Field label="Name *">
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g. Import Declaration"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Description">
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
            Cancel
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
            {isPending ? 'Creating…' : 'Create'}
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
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category: DocumentCategory;
  onClose: () => void;
}) {
  const updateCategory = useUpdateDocumentCategory(category.id);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Code">
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm font-mono shadow-xs text-muted-foreground"
              value={category.code}
              disabled
            />
          </Field>
          <Field label="Name">
            <input
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Description">
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
            Cancel
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
            {updateCategory.isPending ? 'Saving…' : 'Save changes'}
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
