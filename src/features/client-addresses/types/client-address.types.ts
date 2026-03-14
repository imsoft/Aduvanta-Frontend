export interface ClientAddress {
  id: string;
  organizationId: string;
  clientId: string;
  label: string;
  country: string;
  state: string | null;
  city: string | null;
  postalCode: string | null;
  street1: string;
  street2: string | null;
  reference: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
