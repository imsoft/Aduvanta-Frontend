export type ComplianceAlertType =
  | 'NO_RULE_SET'
  | 'MISSING_REQUIRED_DOCUMENT'
  | 'TRANSITION_BLOCKED';

export interface ComplianceAlert {
  type: ComplianceAlertType;
  message: string;
}

export interface CategoryRef {
  id: string;
  name: string;
  code: string;
}

export interface AllowedTransition {
  toStatus: string;
  requiresAllRequiredDocuments: boolean;
  isBlocked: boolean;
  blockReason: string | null;
}

export interface OperationComplianceEvaluation {
  operationId: string;
  operationType: string;
  ruleSetId: string | null;
  ruleSetName: string | null;
  requiredDocumentCategories: CategoryRef[];
  presentDocumentCategories: CategoryRef[];
  missingRequiredDocumentCategories: CategoryRef[];
  allowedTransitions: AllowedTransition[];
  canCurrentWorkflowAdvance: boolean;
  alerts: ComplianceAlert[];
}
