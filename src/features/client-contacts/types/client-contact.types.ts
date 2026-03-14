export interface ClientContact {
  id: string;
  organizationId: string;
  clientId: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
