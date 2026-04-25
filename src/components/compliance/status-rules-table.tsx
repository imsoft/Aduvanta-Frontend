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
import type { StatusTransitionRule } from '@/features/compliance-status-rules/types/status-rule.types';

interface StatusRulesTableProps {
  rules: StatusTransitionRule[];
  canManage: boolean;
  onDelete: (id: string) => void;
  isDeletePending: boolean;
}

export function StatusRulesTable({
  rules,
  canManage,
  onDelete,
  isDeletePending,
}: StatusRulesTableProps) {
  const tCommon = useTranslations('common');
  const t = useTranslations('compliance.statusRulesTable');
  if (rules.length === 0) {
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
          <TableHead>{t('columns.from')}</TableHead>
          <TableHead>{t('columns.to')}</TableHead>
          <TableHead>{t('columns.requiresAllDocs')}</TableHead>
          {canManage && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell className="font-mono text-xs">{rule.fromStatus}</TableCell>
            <TableCell className="font-mono text-xs">{rule.toStatus}</TableCell>
            <TableCell>
              <span
                className={
                  rule.requiresAllRequiredDocuments
                    ? 'text-xs font-medium text-amber-600 dark:text-amber-400'
                    : 'text-xs text-muted-foreground'
                }
              >
                {rule.requiresAllRequiredDocuments ? tCommon('yes') : tCommon('no')}
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
                        {t('removeDescription', { from: rule.fromStatus, to: rule.toStatus })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(rule.id)}
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
        ))}
      </TableBody>
    </Table>
  );
}
