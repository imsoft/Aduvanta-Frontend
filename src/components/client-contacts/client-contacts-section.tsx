'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserPlus, PencilSimple, Trash } from '@phosphor-icons/react';
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
  useClientContacts,
  useCreateClientContact,
  useUpdateClientContact,
  useRemoveClientContact,
} from '@/features/client-contacts/hooks/use-client-contacts';
import type { ClientContact } from '@/features/client-contacts/types/client-contact.types';
import type { ClientContactFormData } from '@/features/client-contacts/schemas/client-contact.schemas';
import { ContactDialog } from './contact-dialog';

interface ClientContactsSectionProps {
  clientId: string;
  canManage: boolean;
}

export function ClientContactsSection({
  clientId,
  canManage,
}: ClientContactsSectionProps) {
  const tCommon = useTranslations('common');
  const { data: contacts = [], isLoading } = useClientContacts(clientId);
  const createContact = useCreateClientContact(clientId);
  const updateContact = useUpdateClientContact(clientId);
  const removeContact = useRemoveClientContact(clientId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClientContact | null>(null);

  const handleCreate = (data: ClientContactFormData) => {
    createContact.mutate(data, { onSuccess: () => setCreateOpen(false) });
  };

  const handleUpdate = (data: ClientContactFormData) => {
    if (!editTarget) return;
    updateContact.mutate(
      { contactId: editTarget.id, dto: data },
      { onSuccess: () => setEditTarget(null) },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Contacts</h2>
        {canManage && (
          <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)} className="gap-2">
            <UserPlus size={14} />
            Add contact
          </Button>
        )}
      </div>

      {isLoading && <TableSkeleton rows={3} columns={canManage ? 5 : 4} />}

      {!isLoading && contacts.length === 0 && (
        <EmptyState title="No contacts yet." />
      )}

      {!isLoading && contacts.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {contact.name}
                      {contact.isPrimary && (
                        <Badge variant="outline" className="text-xs">Primary</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.position ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.email ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.phone ?? '—'}
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditTarget(contact)}
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
                              <AlertDialogTitle>Remove contact?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {contact.name} will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeContact.mutate(contact.id)}
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

      <ContactDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isPending={createContact.isPending}
        title="Add contact"
      />

      <ContactDialog
        open={!!editTarget}
        onOpenChange={(open) => { if (!open) setEditTarget(null); }}
        defaultValues={editTarget ?? undefined}
        onSubmit={handleUpdate}
        isPending={updateContact.isPending}
        title="Edit contact"
      />
    </div>
  );
}
