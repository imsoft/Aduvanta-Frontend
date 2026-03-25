'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation'
import { toast } from 'sonner';
import { ClientForm } from '@/components/clients/client-form';
import { useCreateClient } from '@/features/clients/hooks/use-clients';

export default function NewClientPage() {
  const t = useTranslations();
  const router = useRouter();
  const createClient = useCreateClient();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('clients.newTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('clients.newDescription')}
        </p>
      </div>

      <ClientForm
        onSubmit={(data) => {
          createClient.mutate(data, {
            onSuccess: (client) => {
              toast.success(t('clients.createdToast', { name: client.name }));
              router.push(`/dashboard/clients/${client.id}`);
            },
          });
        }}
        isPending={createClient.isPending}
        submitLabel={t('clients.createClient')}
        onCancel={() => router.push('/dashboard/clients')}
      />
    </div>
  );
}
