export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  legalName: string | null;
  taxId: string | null;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
  notes: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
