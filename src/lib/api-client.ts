import axios from 'axios';
import { useOrgStore } from '@/store/org.store';

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
