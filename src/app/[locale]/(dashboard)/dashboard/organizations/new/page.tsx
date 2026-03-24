'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useOrgStore } from '@/store/org.store';

type FormData = { name: string };

interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
}

export default function NewOrganizationPage() {
  const t = useTranslations()
  const router = useRouter()
  const queryClient = useQueryClient();
  const { setActiveOrg } = useOrgStore();
  const [isLoading, setIsLoading] = useState(false);

  const schema = z.object({
    name: z.string().min(2, t('organizations.nameMinLength')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: standardSchemaResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<OrganizationResponse>(
        '/api/organizations',
        { name: data.name },
      );

      await queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setActiveOrg(response.data.id);
      toast.success(`${response.data.name} created`);
      router.push('/dashboard');
    } catch {
      toast.error(t('organizations.createFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center pt-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('organizations.newTitle')}</CardTitle>
          <CardDescription>
            {t('organizations.newDescription')}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('organizations.nameLabel')}</Label>
              <Input
                id="name"
                autoFocus
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? t('common.creating') : t('organizations.createOrganization')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
