'use client';

import { useState } from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl'
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
import type { FeatureFlag } from '@/features/feature-flags/types/feature-flag.types';
import { useUpdateFeatureFlag, useDeleteFeatureFlag } from '@/features/feature-flags/hooks/use-feature-flags';

interface FeatureFlagsTableProps {
  flags: FeatureFlag[];
  canManage: boolean;
  onCreateClick: () => void;
}

export function FeatureFlagsTable({
  flags,
  canManage,
  onCreateClick,
}: FeatureFlagsTableProps) {
  const t = useTranslations()

  const updateFlag = useUpdateFeatureFlag();
  const deleteFlag = useDeleteFeatureFlag();

  if (flags.length === 0) {
    return (
      <div className="space-y-4">
        {canManage && (
          <div className="flex justify-end">
            <Button size="sm" className="gap-2" onClick={onCreateClick}>
              <Plus size={14} />
              {t('featureFlags.table.newFlag')}
            </Button>
          </div>
        )}
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">{t('featureFlags.table.empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <Button size="sm" className="gap-2" onClick={onCreateClick}>
            <Plus size={14} />
            {t('featureFlags.table.newFlag')}
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('featureFlags.table.columns.key')}</TableHead>
            <TableHead>{t('featureFlags.table.columns.description')}</TableHead>
            <TableHead>{t('featureFlags.table.columns.scope')}</TableHead>
            <TableHead>{t('featureFlags.table.columns.status')}</TableHead>
            {canManage && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.map((flag) => (
            <TableRow key={flag.id}>
              <TableCell className="font-mono text-xs">{flag.key}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-64 truncate">
                {flag.description ?? '—'}
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {flag.organizationId
                    ? t('featureFlags.table.scope.organization')
                    : t('featureFlags.table.scope.global')}
                </span>
              </TableCell>
              <TableCell>
                {canManage && flag.organizationId ? (
                  <button
                    onClick={() =>
                      updateFlag.mutate({
                        flagId: flag.id,
                        input: { isEnabled: !flag.isEnabled },
                      })
                    }
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      flag.isEnabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {flag.isEnabled
                      ? t('featureFlags.table.status.enabled')
                      : t('featureFlags.table.status.disabled')}
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      flag.isEnabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {flag.isEnabled
                      ? t('featureFlags.table.status.enabled')
                      : t('featureFlags.table.status.disabled')}
                  </span>
                )}
              </TableCell>
              {canManage && (
                <TableCell>
                  {flag.organizationId && (
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
                            {t('featureFlags.table.dialog.deleteTitle')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('featureFlags.table.dialog.deleteDescriptionPrefix')}{" "}
                            <span className="font-mono">{flag.key}</span>{" "}
                            {t('featureFlags.table.dialog.deleteDescriptionSuffix')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFlag.mutate(flag.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t('common.delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
