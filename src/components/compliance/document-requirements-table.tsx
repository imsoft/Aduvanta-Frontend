'use client';

import { useTranslations } from 'next-intl';
import { Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import type { DocumentRequirement } from '@/features/compliance-document-requirements/types/document-requirement.types';
import type { DocumentCategory } from '@/features/document-categories/types/document-category.types';

interface DocumentRequirementsTableProps {
  requirements: DocumentRequirement[];
  categories: DocumentCategory[];
  canManage: boolean;
  onDelete: (id: string) => void;
  isDeletePending: boolean;
}

export function DocumentRequirementsTable({
  requirements,
  categories,
  canManage,
  onDelete,
  isDeletePending,
}: DocumentRequirementsTableProps) {
  const tCommon = useTranslations('common');
  const t = useTranslations('compliance.docRequirementsTable');
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  if (requirements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('empty')}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('columns.category')}</TableHead>
          <TableHead>{t('columns.code')}</TableHead>
          <TableHead>{t('columns.required')}</TableHead>
          {canManage && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requirements.map((req) => {
          const cat = categoryMap[req.documentCategoryId];
          return (
            <TableRow key={req.id}>
              <TableCell className="font-medium">{cat?.name ?? req.documentCategoryId}</TableCell>
              <TableCell className="font-mono text-xs">{cat?.code ?? '—'}</TableCell>
              <TableCell>
                <span
                  className={
                    req.isRequired
                      ? 'text-xs font-medium text-amber-600 dark:text-amber-400'
                      : 'text-xs text-muted-foreground'
                  }
                >
                  {req.isRequired ? t('isRequired') : t('isOptional')}
                </span>
              </TableCell>
              {canManage && (
                <TableCell>
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
                        <AlertDialogTitle>{t('removeTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('removeDescription', { name: cat?.name ?? '' })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(req.id)}
                          disabled={isDeletePending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {tCommon('remove')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
