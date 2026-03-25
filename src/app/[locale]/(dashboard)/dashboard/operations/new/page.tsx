'use client';

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
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
  const t = useTranslations()
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
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('operations.newTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('operations.newDescription')}
        </p>
      </div>

      <OperationForm
        clients={clients}
        members={members}
        onSubmit={(data) => {
          createOperation.mutate(data, {
            onSuccess: (operation) => {
              toast.success(t('operations.createdToast', { reference: operation.reference }));
              router.push(`/dashboard/operations/${operation.id}`);
            },
          });
        }}
        isPending={createOperation.isPending}
        submitLabel={t('operations.createOperation')}
        onCancel={() => router.push('/dashboard/operations')}
      />
    </div>
  );
}
