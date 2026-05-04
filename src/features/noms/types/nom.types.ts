export type NomApplication = 'IMPORT' | 'EXPORT' | 'BOTH';

export interface Nom {
  id: string;
  nomKey: string;
  title: string;
  issuingAuthority: string;
  application: NomApplication;
  publicationDate: string | null;
  effectiveDate: string | null;
  status: string;
  notes: string | null;
  doiUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListNomsResult {
  noms: Nom[];
  total: number;
}
