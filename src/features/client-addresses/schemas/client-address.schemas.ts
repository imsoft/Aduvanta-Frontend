import { z } from 'zod';

export const clientAddressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  street1: z.string().min(1, 'Street is required').max(255),
  street2: z.string().max(255).optional(),
  reference: z.string().max(500).optional(),
  isPrimary: z.boolean().optional(),
});

export type ClientAddressFormData = z.infer<typeof clientAddressSchema>;
