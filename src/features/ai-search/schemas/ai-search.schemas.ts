import { z } from 'zod';
import { AI_SEARCH_QUERY_TYPES } from '../types/ai-search.types';

export const createAiSearchQuerySchema = z.object({
  queryType: z.enum(AI_SEARCH_QUERY_TYPES),
  queryText: z.string().min(1).max(500),
});

export type CreateAiSearchQueryFormData = z.infer<typeof createAiSearchQuerySchema>;
