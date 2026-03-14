export const AI_SEARCH_QUERY_TYPES = [
  'PENDING_OPERATIONS',
  'URGENT_WITHOUT_ASSIGNEE',
  'OVERDUE_OPERATIONS',
] as const;

export type AiSearchQueryType = (typeof AI_SEARCH_QUERY_TYPES)[number];

export const AI_SEARCH_QUERY_TYPE_LABELS: Record<AiSearchQueryType, string> = {
  PENDING_OPERATIONS: 'Pending operations',
  URGENT_WITHOUT_ASSIGNEE: 'Urgent operations without assignee',
  OVERDUE_OPERATIONS: 'Overdue operations',
};

export interface AiSearchResultItem {
  operationId: string;
  reference: string;
  title: string;
  status: string;
  priority: string;
  assignedUserId: string | null;
  dueAt: string | null;
  reason: string;
}

export interface AiSearchResult {
  queryType: AiSearchQueryType;
  queryText: string;
  supported: boolean;
  message: string;
  data: AiSearchResultItem[];
}

export interface CreateAiSearchQueryInput {
  queryType: AiSearchQueryType;
  queryText: string;
}
