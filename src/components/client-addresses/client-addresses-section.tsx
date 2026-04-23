'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, PencilSimple, Trash } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
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
import { EmptyState } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/loading-skeletons';
import {
  useClientAddresses,
  useCreateClientAddress,
  useUpdateClientAddress,
  useRemoveClientAddress,
} from '@/features/client-addresses/hooks/use-client-addresses';
import type { ClientAddress } from '@/features/client-addresses/types/client-address.types';
import type { ClientAddressFormData } from '@/features/client-addresses/schemas/client-address.schemas';
import { AddressDialog } from './address-dialog';

interface ClientAddressesSectionProps {
  clientId: string;
  canManage: boolean;
}

export function ClientAddressesSection({
  clientId,
  canManage,
}: ClientAddressesSectionProps) {
  const tCommon = useTranslations('common');
  const { data: addresses = [], isLoading } = useClientAddresses(clientId);
  const createAddress = useCreateClientAddress(clientId);
  const updateAddress = useUpdateClientAddress(clientId);
  const removeAddress = useRemoveClientAddress(clientId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClientAddress | null>(null);

  const handleCreate = (data: ClientAddressFormData) => {
    createAddress.mutate(data, { onSuccess: () => setCreateOpen(false) });
  };

  const handleUpdate = (data: ClientAddressFormData) => {
    if (!editTarget) return;
    updateAddress.mutate(
      { addressId: editTarget.id, dto: data },
      { onSuccess: () => setEditTarget(null) },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Addresses</h2>
        {canManage && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCreateOpen(true)}
            className="gap-2"
          >
            <MapPin size={14} />
            Add address
          </Button>
        )}
      </div>

      {isLoading && <TableSkeleton rows={3} columns={canManage ? 5 : 4} />}

      {!isLoading && addresses.length === 0 && (
        <EmptyState title="No addresses yet." />
      )}

      {!isLoading && addresses.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City / State</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((addr) => (
                <TableRow key={addr.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {addr.label}
                      {addr.isPrimary && (
                        <Badge variant="outline" className="text-xs">Primary</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {addr.street1}
                    {addr.street2 ? `, ${addr.street2}` : ''}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {[addr.city, addr.state].filter(Boolean).join(', ') || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {addr.country}
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditTarget(addr)}
                        >
                          <PencilSimple size={13} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            >
                              <Trash size={13} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove address?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {addr.label} will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeAddress.mutate(addr.id)}
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
        </div>
      )}

      <AddressDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isPending={createAddress.isPending}
        title="Add address"
      />

      <AddressDialog
        open={!!editTarget}
        onOpenChange={(open) => { if (!open) setEditTarget(null); }}
        defaultValues={editTarget ?? undefined}
        onSubmit={handleUpdate}
        isPending={updateAddress.isPending}
        title="Edit address"
      />
    </div>
  );
}
