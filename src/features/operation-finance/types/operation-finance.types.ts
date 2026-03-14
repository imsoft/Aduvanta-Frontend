export type FinancialStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'NO_CHARGES';

export interface OperationFinanceSummary {
  totalCharges: string;
  totalAdvances: string;
  pendingBalance: string;
  financialStatus: FinancialStatus;
}
