'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  clientAddressSchema,
  type ClientAddressFormData,
} from '@/features/client-addresses/schemas/client-address.schemas';
import type { ClientAddress } from '@/features/client-addresses/types/client-address.types';

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: ClientAddress;
  onSubmit: (data: ClientAddressFormData) => void;
  isPending: boolean;
  title: string;
}

export function AddressDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending,
  title,
}: AddressDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientAddressFormData>({
    resolver: standardSchemaResolver(clientAddressSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        label: defaultValues?.label ?? '',
        country: defaultValues?.country ?? '',
        state: defaultValues?.state ?? '',
        city: defaultValues?.city ?? '',
        postalCode: defaultValues?.postalCode ?? '',
        street1: defaultValues?.street1 ?? '',
        street2: defaultValues?.street2 ?? '',
        reference: defaultValues?.reference ?? '',
        isPrimary: defaultValues?.isPrimary ?? false,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the address information below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="addr-label">Label *</Label>
              <Input id="addr-label" {...register('label')} />
              {errors.label && (
                <p className="text-xs text-destructive">{errors.label.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-country">Country *</Label>
              <Input id="addr-country" {...register('country')} />
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-street1">Street *</Label>
            <Input id="addr-street1" {...register('street1')} />
            {errors.street1 && (
              <p className="text-xs text-destructive">{errors.street1.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-street2">Street 2</Label>
            <Input id="addr-street2" {...register('street2')} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="addr-city">City</Label>
              <Input id="addr-city" {...register('city')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-state">State</Label>
              <Input id="addr-state" {...register('state')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-postal">Postal code</Label>
              <Input id="addr-postal" {...register('postalCode')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-reference">Reference</Label>
            <Input id="addr-reference" {...register('reference')} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="addr-primary"
              className="h-4 w-4 rounded border"
              {...register('isPrimary')}
            />
            <Label htmlFor="addr-primary" className="font-normal">
              Set as primary address
            </Label>
          </div>

          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : 'Save'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
