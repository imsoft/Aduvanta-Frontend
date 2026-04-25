import axios, { type AxiosError } from 'axios';
import { useOrgStore } from '@/store/org.store';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  withCredentials: true, // required for Better Auth session cookies
  headers: { 'Content-Type': 'application/json' },
});

// Attach the active organization ID to every request that needs it.
apiClient.interceptors.request.use((config) => {
  const { activeOrgId } = useOrgStore.getState();
  if (activeOrgId) {
    config.headers['x-organization-id'] = activeOrgId;
  }
  return config;
});

// Handle rate limit (429) and abuse block (403) responses globally.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; retryAfterMs?: number; code?: string }>) => {
    if (error.response?.status === 429) {
      const retryAfterMs = error.response.data?.retryAfterMs ?? 60_000;
      const seconds = Math.ceil(retryAfterMs / 1000);
      toast.error(`Too many requests. Please wait ${seconds} seconds.`);
    }

    if (
      error.response?.status === 409 &&
      error.response.data?.code === 'DUPLICATE_REQUEST'
    ) {
      toast.info('Request already in progress. Please wait.');
      return Promise.resolve(error.response);
    }

    return Promise.reject(error);
  },
);
