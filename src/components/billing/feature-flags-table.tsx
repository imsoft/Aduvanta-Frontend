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
  const updateFlag = useUpdateFeatureFlag();
  const deleteFlag = useDeleteFeatureFlag();

  if (flags.length === 0) {
    return (
      <div className="space-y-4">
        {canManage && (
          <div className="flex justify-end">
            <Button size="sm" className="gap-2" onClick={onCreateClick}>
              <Plus size={14} />
              New flag
            </Button>
          </div>
        )}
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">No feature flags configured yet.</p>
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
            New flag
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Status</TableHead>
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
                  {flag.organizationId ? 'Organization' : 'Global'}
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
                    {flag.isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      flag.isEnabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {flag.isEnabled ? 'Enabled' : 'Disabled'}
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
                          <AlertDialogTitle>Delete feature flag?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Feature flag <span className="font-mono">{flag.key}</span> will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFlag.mutate(flag.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
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
