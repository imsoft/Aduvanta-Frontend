export type ShipmentStatus =
  | 'PENDING'
  | 'IN_TRANSIT'
  | 'AT_CUSTOMS'
  | 'PREVIO'
  | 'DISPATCHING'
  | 'MODULATION'
  | 'GREEN_LIGHT'
  | 'RED_LIGHT'
  | 'INSPECTION'
  | 'RELEASED'
  | 'DELIVERED'
  | 'HELD'
  | 'CANCELLED';

export type ShipmentType = 'IMPORT' | 'EXPORT' | 'TRANSIT';

export interface Shipment {
  id: string;
  organizationId: string;
  primaryEntryId: string | null;
  type: ShipmentType;
  status: ShipmentStatus;
  trackingNumber: string;
  clientReference: string | null;
  clientName: string | null;
  clientTaxId: string | null;
  goodsDescription: string | null;
  originCountry: string | null;
  originCity: string | null;
  destinationCountry: string | null;
  destinationCity: string | null;
  transportMode: number | null;
  carrierName: string | null;
  vesselName: string | null;
  voyageNumber: string | null;
  billOfLading: string | null;
  containerNumbers: string | null;
  totalPackages: number | null;
  totalGrossWeightKg: string | null;
  totalNetWeightKg: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListShipmentsResult {
  shipments: Shipment[];
  total: number;
}
