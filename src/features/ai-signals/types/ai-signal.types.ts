export type SignalSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type SignalCode =
  | 'MISSING_REQUIRED_DOCUMENTS'
  | 'BLOCKED_STATUS_TRANSITION'
  | 'OVERDUE_OPERATION'
  | 'NO_ASSIGNEE'
  | 'PENDING_FINANCIAL_BALANCE';

export interface OperationSignal {
  code: SignalCode;
  severity: SignalSeverity;
  title: string;
  description: string;
  source: string;
}

export interface OperationSignalsResponse {
  operationId: string;
  signals: OperationSignal[];
}
