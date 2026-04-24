export type EntryStatus =
  | 'DRAFT'
  | 'PREVALIDATED'
  | 'VALIDATED'
  | 'PAID'
  | 'DISPATCHED'
  | 'RELEASED'
  | 'CANCELLED'
  | 'RECTIFIED';

export type CustomsRegime =
  | 'IMP_DEFINITIVA'
  | 'EXP_DEFINITIVA'
  | 'IMP_TEMPORAL'
  | 'EXP_TEMPORAL'
  | 'DEPOSITO_FISCAL'
  | 'TRANSITO_INTERNO'
  | 'TRANSITO_INTERNACIONAL'
  | 'ELABORACION_TRANSFORMACION'
  | 'REEXPEDICION'
  | 'RETORNO'
  | 'REGULARIZACION'
  | 'CAMBIO_REGIMEN'
  | 'EXTRACCION_DEPOSITO'
  | 'VIRTUAL'
  | 'OTHER';

export interface CustomsEntry {
  id: string;
  organizationId: string;
  customsOfficeId: string;
  patentId: string;
  entryNumber: string | null;
  entryKey: string;
  regime: CustomsRegime;
  status: EntryStatus;
  operationType: number;
  entryDate: string | null;
  paymentDate: string | null;
  arrivalDate: string | null;
  transportMode: number | null;
  carrierName: string | null;
  transportDocumentNumber: string | null;
  originCountry: string | null;
  destinationCountry: string | null;
  exchangeRate: string | null;
  invoiceCurrency: string | null;
  totalCommercialValueUsd: string | null;
  totalCommercialValueMxn: string | null;
  totalCustomsValueMxn: string | null;
  totalDuties: string | null;
  totalVat: string | null;
  totalDta: string | null;
  totalOtherTaxes: string | null;
  grandTotal: string | null;
  paymentReference: string | null;
  internalReference: string | null;
  observations: string | null;
  createdById: string;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomsEntryItem {
  id: string;
  entryId: string;
  sequenceNumber: number;
  tariffFraction: string | null;
  tariffSubdivision: string | null;
  description: string;
  quantity: string | null;
  unitOfMeasure: string | null;
  commercialQuantity: string | null;
  commercialUnitOfMeasure: string | null;
  commercialValueUsd: string | null;
  customsValueMxn: string | null;
  countryOfOrigin: string | null;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  createdAt: string;
}

export interface CustomsEntryParty {
  id: string;
  entryId: string;
  partyType: string;
  name: string;
  taxId: string | null;
  address: string | null;
  country: string | null;
  createdAt: string;
}

export interface CustomsEntryDocument {
  id: string;
  entryId: string;
  documentType: string;
  documentNumber: string;
  documentDate: string | null;
  countryCode: string | null;
  currency: string | null;
  value: string | null;
  createdAt: string;
}

export interface CustomsOffice {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
}

export interface CustomsPatent {
  id: string;
  organizationId: string;
  patentNumber: string;
  holderName: string;
  holderRfc: string;
  isActive: boolean;
}

export interface CustomsEntryDetail extends CustomsEntry {
  items: CustomsEntryItem[];
  parties: CustomsEntryParty[];
  documents: CustomsEntryDocument[];
  statusHistory: { id: string; fromStatus: string | null; toStatus: string; changedById: string; comment: string | null; createdAt: string }[];
}

export interface ListCustomsEntriesResult {
  entries: CustomsEntry[];
  total: number;
}
