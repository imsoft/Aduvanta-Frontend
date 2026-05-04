export type SatBlacklistType =
  | 'ARTICLE_69B'
  | 'DEFINITIVE_69B'
  | 'FAVORABLE_69B'
  | 'PRESUMED_EDOS'
  | 'DEFINITIVE_EDOS'
  | 'ARTICLE_69'
  | 'CANCELED_SEAL'
  | 'RESTRICTED_SEAL';

export interface SatBlacklistEntry {
  id: string;
  taxId: string;
  taxpayerName: string | null;
  listType: SatBlacklistType;
  publicationDate: string | null;
  definitivoDate: string | null;
  notes: string | null;
  sourceUrl: string | null;
  importedAt: string;
  updatedAt: string;
}

export interface TaxpayerCheckResult {
  taxId: string;
  found: boolean;
  entries: SatBlacklistEntry[];
}

export interface ListBlacklistResult {
  entries: SatBlacklistEntry[];
  total: number;
}
