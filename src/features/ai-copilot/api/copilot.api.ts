import { apiClient } from '@/lib/api-client';

export interface CopilotMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface CopilotResponse {
  sessionId: string;
  text: string;
  history: CopilotMessage[];
}

export const copilotApi = {
  sendMessage: async (
    orgId: string,
    message: string,
    sessionId?: string,
  ): Promise<CopilotResponse> => {
    const { data } = await apiClient.post(
      '/api/ai/copilot/message',
      { message, sessionId },
      { headers: { 'x-organization-id': orgId } },
    );
    return data;
  },
};
