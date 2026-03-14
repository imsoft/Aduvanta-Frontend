'use client';

import { useState } from 'react';
import { Plus, Trash, UserCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  useClientPortalAccess,
  useGrantPortalAccess,
  useRevokePortalAccess,
} from '@/features/client-portal-access/hooks/use-client-portal-access';

interface PortalAccessMember {
  id: string;
  name: string;
  email: string;
}

interface ClientPortalAccessSectionProps {
  clientId: string;
  canManage: boolean;
  members: PortalAccessMember[];
}

export function ClientPortalAccessSection({
  clientId,
  canManage,
  members,
}: ClientPortalAccessSectionProps) {
  const [grantOpen, setGrantOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const { data: accessList = [], isLoading } = useClientPortalAccess(clientId);
  const grantAccess = useGrantPortalAccess(clientId);
  const revokeAccess = useRevokePortalAccess(clientId);

  const grantedUserIds = new Set(accessList.map((a) => a.userId));
  const availableMembers = members.filter((m) => !grantedUserIds.has(m.id));

  function handleGrant() {
    if (!selectedUserId) return;
    grantAccess.mutate(
      { clientId, userId: selectedUserId },
      {
        onSuccess: () => {
          setGrantOpen(false);
          setSelectedUserId('');
        },
      },
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Portal access</h2>
        {canManage && availableMembers.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => setGrantOpen(true)} className="gap-2">
            <Plus size={14} />
            Grant access
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : accessList.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No users have portal access to this client.
        </p>
      ) : (
        <ul className="space-y-2">
          {accessList.map((access) => {
            const member = members.find((m) => m.id === access.userId);
            return (
              <li
                key={access.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <UserCircle size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {member?.name ?? access.userId}
                    </p>
                    {member?.email && (
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    )}
                  </div>
                </div>
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
                        <AlertDialogTitle>Revoke portal access?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {member?.name ?? access.userId} will lose access to this client&apos;s
                          portal.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => revokeAccess.mutate(access.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={grantOpen} onOpenChange={setGrantOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grant portal access</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              User
            </label>
            <select
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select a user…</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGrantOpen(false)}
              disabled={grantAccess.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGrant}
              disabled={!selectedUserId || grantAccess.isPending}
            >
              {grantAccess.isPending ? 'Granting…' : 'Grant access'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
