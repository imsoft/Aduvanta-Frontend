export interface TradeAgreement {
  id: string;
  code: string;
  name: string;
  partnerCountries: string;
  effectiveDate: string | null;
  expirationDate: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TariffPreference {
  id: string;
  agreementId: string;
  fractionId: string;
  preferentialRate: string;
  ruleOfOrigin: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListTradeAgreementsResult {
  agreements: TradeAgreement[];
  total: number;
}
