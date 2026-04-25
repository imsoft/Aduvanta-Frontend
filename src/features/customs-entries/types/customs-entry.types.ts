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

  // Dates
  entryDate: string | null;
  paymentDate: string | null;
  arrivalDate: string | null;
  exitDate: string | null;

  // Transport
  transportMode: number | null;
  carrierName: string | null;
  transportDocumentNumber: string | null;

  // Countries
  originCountry: string | null;
  destinationCountry: string | null;

  // Exchange rate / currency
  exchangeRate: string | null;
  invoiceCurrency: string | null;

  // Goods summary
  grossWeightKg: string | null;
  packageCount: number | null;
  packageMarks: string | null;

  // Incrementables (Art. 65-66 Ley Aduanera)
  freightValue: string | null;
  insuranceValue: string | null;
  packagingValue: string | null;
  otherIncrementables: string | null;

  // INCOTERM and valuation
  incoterm: string | null;
  vinculacion: string | null;
  valueReceiptNumber: string | null;

  // Payment
  paymentMethod: string | null;
  paymentReference: string | null;

  // SAAI fields
  acceptanceCode: string | null;
  customsSectionKey: string | null;

  // Total values
  totalCommercialValueUsd: string | null;
  totalCommercialValueMxn: string | null;
  totalCustomsValueMxn: string | null;
  totalDuties: string | null;
  totalVat: string | null;
  totalDta: string | null;
  totalOtherTaxes: string | null;
  grandTotal: string | null;

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
  itemNumber: number;
  tariffFractionCode: string | null;
  tariffSubdivision: string | null;
  valuationMethod: number | null;
  description: string;
  originCountry: string | null;
  // UMT (tariff unit)
  quantity: string | null;
  measurementUnit: string | null;
  // UMC (commercial unit)
  commercialQuantity: string | null;
  commercialUnitOfMeasure: string | null;
  // Weight
  grossWeightKg: string | null;
  netWeightKg: string | null;
  // Values
  commercialValueUsd: string | null;
  paidPriceUsd: string | null;
  unitPriceUsd: string | null;
  customsValueMxn: string | null;
  customsValueUsd: string | null;
  incrementablesMxn: string | null;
  addedValueMxn: string | null;
  // Trade
  tradeAgreementCode: string | null;
  vinculacion: string | null;
  // Product details
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  productCode: string | null;
  observations: string | null;
  createdAt: string;
}

export interface CustomsEntryParty {
  id: string;
  entryId: string;
  role: string;
  name: string;
  taxId: string | null;
  curp: string | null;
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

export interface CustomsEntryIdentifier {
  id: string;
  entryId: string;
  itemId: string | null;
  level: string;
  code: string;
  complement1: string | null;
  complement2: string | null;
  complement3: string | null;
}

export interface CustomsEntryContainer {
  id: string;
  entryId: string;
  number: string;
  containerType: string | null;
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
  identifiers: CustomsEntryIdentifier[];
  containers: CustomsEntryContainer[];
  statusHistory: {
    id: string;
    fromStatus: string | null;
    toStatus: string;
    changedById: string;
    comment: string | null;
    createdAt: string;
  }[];
}

export interface ListCustomsEntriesResult {
  entries: CustomsEntry[];
  total: number;
}
