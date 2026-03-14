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
  clientContactSchema,
  type ClientContactFormData,
} from '@/features/client-contacts/schemas/client-contact.schemas';
import type { ClientContact } from '@/features/client-contacts/types/client-contact.types';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: ClientContact;
  onSubmit: (data: ClientContactFormData) => void;
  isPending: boolean;
  title: string;
}

export function ContactDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending,
  title,
}: ContactDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientContactFormData>({
    resolver: standardSchemaResolver(clientContactSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? '',
        email: defaultValues?.email ?? '',
        phone: defaultValues?.phone ?? '',
        position: defaultValues?.position ?? '',
        isPrimary: defaultValues?.isPrimary ?? false,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the contact information below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact-name">Name *</Label>
            <Input id="contact-name" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" {...register('email')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input id="contact-phone" {...register('phone')} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-position">Position</Label>
            <Input id="contact-position" {...register('position')} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="contact-primary"
              className="h-4 w-4 rounded border"
              {...register('isPrimary')}
            />
            <Label htmlFor="contact-primary" className="font-normal">
              Set as primary contact
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
