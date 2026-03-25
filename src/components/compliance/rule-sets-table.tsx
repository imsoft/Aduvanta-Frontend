'use client';

import { Link } from '@/i18n/navigation'
import { ArrowRight, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl'
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
import type { RuleSet } from '@/features/compliance-rule-sets/types/rule-set.types';

interface RuleSetsTableProps {
  ruleSets: RuleSet[];
  canManage: boolean;
  onDelete: (id: string) => void;
  isDeletePending: boolean;
}

export function RuleSetsTable({
  ruleSets,
  canManage,
  onDelete,
  isDeletePending,
}: RuleSetsTableProps) {
  const t = useTranslations()

  if (ruleSets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('compliance.ruleSetsTable.empty')}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('compliance.ruleSetsTable.columns.name')}</TableHead>
          <TableHead>{t('compliance.ruleSetsTable.columns.code')}</TableHead>
          <TableHead>{t('compliance.ruleSetsTable.columns.operationType')}</TableHead>
          <TableHead>{t('compliance.ruleSetsTable.columns.active')}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {ruleSets.map((rs) => (
          <TableRow key={rs.id}>
            <TableCell className="font-medium">{rs.name}</TableCell>
            <TableCell className="font-mono text-xs">{rs.code}</TableCell>
            <TableCell>{rs.operationType}</TableCell>
            <TableCell>
              <span
                className={
                  rs.isActive
                    ? 'text-xs font-medium text-green-600 dark:text-green-400'
                    : 'text-xs font-medium text-muted-foreground'
                }
              >
                {rs.isActive ? t('common.yes') : t('common.no')}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 justify-end">
                <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                  <Link href={`/dashboard/compliance/rule-sets/${rs.id}`}>
                    <ArrowRight size={14} />
                  </Link>
                </Button>
                {canManage && (
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
                        <AlertDialogTitle>
                          {t('compliance.ruleSetsTable.dialog.deleteTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('compliance.ruleSetsTable.dialog.deleteDescription', {
                            name: rs.name,
                          })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(rs.id)}
                          disabled={isDeletePending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t('common.delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
