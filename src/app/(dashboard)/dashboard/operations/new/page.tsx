'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OperationForm } from '@/components/operations/operation-form';
import { useCreateOperation } from '@/features/operations/hooks/use-operations';
import { useOrgStore } from '@/store/org.store';
import { apiClient } from '@/lib/api-client';
import type { Client } from '@/features/clients/types/client.types';

interface MemberUser {
  id: string;
  name: string;
}

interface MemberWithUser {
  membership: { id: string; userId: string };
  user: MemberUser;
}

export default function NewOperationPage() {
  const router = useRouter();
  const { activeOrgId } = useOrgStore();
  const createOperation = useCreateOperation();

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get<Client[]>('/api/clients', {
        headers: { 'x-organization-id': activeOrgId! },
        params: { status: 'ACTIVE' },
      });
      return data;
    },
    enabled: !!activeOrgId,
  });

  const { data: membersRaw = [] } = useQuery<MemberWithUser[]>({
    queryKey: ['members', activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get<MemberWithUser[]>('/api/memberships', {
        headers: { 'x-organization-id': activeOrgId! },
      });
      return data;
    },
    enabled: !!activeOrgId,
  });

  const members = membersRaw.map(({ user }) => ({ id: user.id, name: user.name }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New operation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new customs operation for your organization
        </p>
      </div>

      <OperationForm
        clients={clients}
        members={members}
        onSubmit={(data) => {
          createOperation.mutate(data, {
            onSuccess: (operation) => {
              toast.success(`Operation ${operation.reference} created`);
              router.push(`/dashboard/operations/${operation.id}`);
            },
          });
        }}
        isPending={createOperation.isPending}
        submitLabel="Create operation"
        onCancel={() => router.push('/dashboard/operations')}
      />
    </div>
  );
}
