'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, PencilSimple, X, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { ClientStatusBadge } from '@/components/clients/client-status-badge';
import { ClientForm } from '@/components/clients/client-form';
import { ClientContactsSection } from '@/components/client-contacts/client-contacts-section';
import { ClientAddressesSection } from '@/components/client-addresses/client-addresses-section';
import { ClientPortalAccessSection } from '@/components/client-portal-access/client-portal-access-section';
import { InfoField } from '@/components/ui/info-field';
import {
  useClient,
  useUpdateClient,
  useDeactivateClient,
} from '@/features/clients/hooks/use-clients';
import { useCanManage } from '@/hooks/use-permissions';
import { useMembers } from '@/hooks/use-members';
import type { CreateClientFormData } from '@/features/clients/schemas/client.schemas';

export default function ClientDetailPage() {
  const t = useTranslations();
  const params = useParams<{ clientId: string }>();
  const router = useRouter();
  const { clientId } = params;

  const canManage = useCanManage();

  const { data: client, isLoading } = useClient(clientId);
  const updateClient = useUpdateClient(clientId);
  const deactivateClient = useDeactivateClient();

  const { data: membersRaw = [] } = useMembers();
  const members = membersRaw.map(({ user }) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  const [editing, setEditing] = useState(false);

  const handleUpdate = (data: CreateClientFormData) => {
    updateClient.mutate(data, { onSuccess: () => setEditing(false) });
  };

  const handleDeactivate = () => {
    deactivateClient.mutate(clientId, {
      onSuccess: () => router.push('/dashboard/clients'),
    });
  };

  if (isLoading) {
    return <div className="w-full text-sm text-muted-foreground">{t('common.loading')}</div>;
  }

  if (!client) {
    return (
      <div className="w-full space-y-4">
        <p className="text-sm text-muted-foreground">{t('clients.notFound')}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/clients">
            <ArrowLeft size={14} />
            {t('clients.backToClients')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/dashboard/clients">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
              <ClientStatusBadge status={client.status} />
            </div>
            {client.legalName && (
              <p className="text-sm text-muted-foreground mt-0.5">{client.legalName}</p>
            )}
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            {!editing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                className="gap-2"
              >
                <PencilSimple size={14} />
                {t('common.edit')}
              </Button>
            )}
            {client.status === 'ACTIVE' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive gap-2">
                    <X size={14} />
                    {t('clients.deactivate')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('clients.deactivateTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('clients.deactivateDescription', { name: client.name })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivate}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('clients.deactivate')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* General info */}
      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{t('clients.generalInformation')}</h2>
          {editing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(false)}
              className="gap-1 text-muted-foreground"
            >
              <X size={14} />
              {t('common.cancel')}
            </Button>
          )}
        </div>

        {editing ? (
          <ClientForm
            defaultValues={client}
            onSubmit={handleUpdate}
            isPending={updateClient.isPending}
            submitLabel={t('common.saveChanges')}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoField label={t('clients.name')} value={client.name} />
            <InfoField label={t('clients.legalName')} value={client.legalName} />
            <InfoField label={t('clients.taxId')} value={client.taxId} />
            <InfoField label={t('clients.email')} value={client.email} />
            <InfoField label={t('clients.phone')} value={client.phone} />
            <InfoField label={t('clients.status')} value={client.status} />
            {client.notes && (
              <div className="sm:col-span-2 lg:col-span-3">
                <InfoField label={t('clients.notes')} value={client.notes} />
              </div>
            )}
          </dl>
        )}
      </section>

      <Separator />

      {/* Contacts */}
      <ClientContactsSection clientId={clientId} canManage={canManage} />

      <Separator />

      {/* Addresses */}
      <ClientAddressesSection clientId={clientId} canManage={canManage} />

      <Separator />

      {/* Portal access */}
      <ClientPortalAccessSection
        clientId={clientId}
        canManage={canManage}
        members={members}
      />
    </div>
  );
}
