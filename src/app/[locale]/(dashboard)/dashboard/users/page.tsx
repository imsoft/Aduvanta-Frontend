'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserPlus, Trash } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { apiClient } from '@/lib/api-client';
import { useOrgStore } from '@/store/org.store';
import { useCanManage } from '@/hooks/use-permissions';
import type { MemberWithUser } from '@/features/memberships/types/membership.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { TableSkeleton } from '@/components/ui/loading-skeletons';

const ROLE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  OWNER: 'default',
  ADMIN: 'secondary',
  MEMBER: 'outline',
};

async function fetchMembers(orgId: string): Promise<MemberWithUser[]> {
  const { data } = await apiClient.get<MemberWithUser[]>('/api/memberships', {
    headers: { 'x-organization-id': orgId },
  });
  return data;
}

export default function UsersPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { activeOrgId, organizations } = useOrgStore();
  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const canManage = useCanManage();

  const inviteSchema = z.object({
    email: z.string().email(t('validation.invalidEmail')),
    role: z.enum(['ADMIN', 'MEMBER']),
  });
  type InviteFormData = z.infer<typeof inviteSchema>;

  const [roleSelections, setRoleSelections] = useState<Record<string, string>>({});

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', activeOrgId],
    queryFn: () => fetchMembers(activeOrgId!),
    enabled: !!activeOrgId,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: standardSchemaResolver(inviteSchema),
    defaultValues: { role: 'MEMBER' },
  });

  const invite = useMutation({
    mutationFn: (data: InviteFormData) =>
      apiClient.post('/api/memberships', data, {
        headers: { 'x-organization-id': activeOrgId! },
      }),
    onSuccess: () => {
      toast.success(t('members.invited'));
      reset({ role: 'MEMBER' });
      queryClient.invalidateQueries({ queryKey: ['members', activeOrgId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('members.inviteFailed'));
    },
  });

  const updateRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiClient.patch(`/api/memberships/${userId}`, { role }, {
        headers: { 'x-organization-id': activeOrgId! },
      }),
    onSuccess: (_, { userId }) => {
      toast.success(t('members.roleUpdated'));
      setRoleSelections((prev) => ({ ...prev, [userId]: '' }));
      queryClient.invalidateQueries({ queryKey: ['members', activeOrgId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('members.roleUpdateFailed'));
    },
  });

  const remove = useMutation({
    mutationFn: (userId: string) =>
      apiClient.delete(`/api/memberships/${userId}`, {
        headers: { 'x-organization-id': activeOrgId! },
      }),
    onSuccess: () => {
      toast.success(t('members.removed'));
      queryClient.invalidateQueries({ queryKey: ['members', activeOrgId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? t('members.removeFailed'));
    },
  });

  if (!activeOrgId) {
    return (
      <div className="w-full text-sm text-muted-foreground">
        {t('members.selectOrg')}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('members.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('members.description', { orgName: activeOrg?.name ?? '' })}
          </p>
        </div>
      </div>

      {canManage && (
        <form
          onSubmit={handleSubmit((data) => invite.mutate(data))}
          className="flex items-end gap-3 rounded-lg border p-4"
        >
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="invite-email">{t('members.inviteByEmail')}</Label>
            <Input
              id="invite-email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="w-36 space-y-1.5">
            <Label>{t('members.role')}</Label>
            <Select
              defaultValue="MEMBER"
              onValueChange={(v) => setValue('role', v as 'ADMIN' | 'MEMBER')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">{t('roles.admin')}</SelectItem>
                <SelectItem value="MEMBER">{t('roles.member')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={invite.isPending} className="gap-2">
            <UserPlus size={14} />
            {invite.isPending ? t('members.inviting') : t('members.invite')}
          </Button>
        </form>
      )}

      {isLoading && <TableSkeleton rows={6} columns={canManage ? 5 : 3} />}

      {!isLoading && members.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('members.name')}</TableHead>
                <TableHead>{t('members.email')}</TableHead>
                <TableHead>{t('members.role')}</TableHead>
                {canManage && <TableHead className="w-48">{t('members.changeRole')}</TableHead>}
                {canManage && <TableHead className="w-16" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(({ membership, user }) => {
                const selectedRole = roleSelections[user.id];
                const isOwner = membership.role === 'OWNER';

                return (
                  <TableRow key={membership.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={ROLE_VARIANT[membership.role] ?? 'outline'}>
                        {membership.role}
                      </Badge>
                    </TableCell>

                    {canManage && (
                      <TableCell>
                        {isOwner ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Select
                              value={selectedRole || membership.role}
                              onValueChange={(v) =>
                                setRoleSelections((prev) => ({ ...prev, [user.id]: v }))
                              }
                            >
                              <SelectTrigger className="h-7 w-28 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">{t('roles.admin')}</SelectItem>
                                <SelectItem value="MEMBER">{t('roles.member')}</SelectItem>
                              </SelectContent>
                            </Select>
                            {selectedRole && selectedRole !== membership.role && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                disabled={updateRole.isPending}
                                onClick={() =>
                                  updateRole.mutate({ userId: user.id, role: selectedRole })
                                }
                              >
                                {t('common.save')}
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    )}

                    {canManage && (
                      <TableCell>
                        {!isOwner && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              >
                                <Trash size={14} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('members.removeMember')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('members.removeDescription', { name: user.name, orgName: activeOrg?.name ?? '' })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => remove.mutate(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {t('members.remove')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
