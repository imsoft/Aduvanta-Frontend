'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/navigation';
import { useOrgStore } from '@/store/org.store';
import { shipmentsApi } from '@/features/shipments/api/shipments.api';

const schema = z.object({
  type: z.enum(['IMPORT', 'EXPORT', 'TRANSIT']),
  clientName: z.string().optional(),
  clientReference: z.string().optional(),
  goodsDescription: z.string().optional(),
  originCountry: z.string().optional(),
  destinationCountry: z.string().optional(),
  carrierName: z.string().optional(),
  billOfLading: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NuevoEmbarquePage() {
  const t = useTranslations();
  const router = useRouter();
  const { activeOrgId } = useOrgStore();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { type: 'IMPORT' },
  });

  const onSubmit = async (data: FormData) => {
    if (!activeOrgId) return;
    setIsPending(true);
    try {
      await shipmentsApi.create(activeOrgId, data);
      toast.success(t('shipments.created'));
      router.push('/dashboard/embarques');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? t('common.saving'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/embarques">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('shipments.newTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t('shipments.newDescription')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border p-6">
        {/* Type — required */}
        <div className="space-y-1.5">
          <Label>{t('shipments.typeLabel')} *</Label>
          <Select defaultValue="IMPORT" onValueChange={(v) => setValue('type', v as FormData['type'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMPORT">{t('shipments.types.IMPORT')}</SelectItem>
              <SelectItem value="EXPORT">{t('shipments.types.EXPORT')}</SelectItem>
              <SelectItem value="TRANSIT">{t('shipments.types.TRANSIT')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t('shipments.clientNameLabel')}</Label>
            <Input {...register('clientName')} placeholder="Ej. Importadora del Norte S.A." />
          </div>
          <div className="space-y-1.5">
            <Label>{t('shipments.clientReferenceLabel')}</Label>
            <Input {...register('clientReference')} placeholder="Ej. REF-2026-001" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{t('shipments.goodsDescriptionLabel')}</Label>
          <Textarea
            {...register('goodsDescription')}
            rows={2}
            placeholder="Descripción general de las mercancías"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t('shipments.originCountryLabel')}</Label>
            <Input {...register('originCountry')} placeholder="Ej. CN" />
          </div>
          <div className="space-y-1.5">
            <Label>{t('shipments.destinationCountryLabel')}</Label>
            <Input {...register('destinationCountry')} placeholder="Ej. MX" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t('shipments.carrierNameLabel')}</Label>
            <Input {...register('carrierName')} placeholder="Ej. Maersk" />
          </div>
          <div className="space-y-1.5">
            <Label>{t('shipments.billOfLadingLabel')}</Label>
            <Input {...register('billOfLading')} placeholder="Ej. MSCUX1234567" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/embarques">{t('common.cancel')}</Link>
          </Button>
          <Button type="submit" disabled={isPending || !activeOrgId}>
            {isPending ? t('common.creating') : t('shipments.new')}
          </Button>
        </div>
      </form>
    </div>
  );
}
