'use client';

import { useEffect, useRef } from 'react';
import { useOrgStore } from '@/store/org.store';

export type RealtimeEventType =
  | 'CUSTOMS_ENTRY_STATUS_CHANGED'
  | 'OPERATION_STATUS_CHANGED'
  | 'OPERATION_ASSIGNED'
  | 'NEW_NOTIFICATION'
  | 'SHIPMENT_STATUS_CHANGED';

export interface RealtimeEvent {
  type: RealtimeEventType;
  organizationId: string;
  resourceId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

type EventHandler = (event: RealtimeEvent) => void;

export function useRealtimeEvents(onEvent: EventHandler) {
  const { activeOrgId } = useOrgStore();
  const sourceRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);

  useEffect(() => {
    if (!activeOrgId) return;

    const connect = () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
      const url = `${apiUrl}/api/events/stream`;

      const es = new EventSource(url, { withCredentials: true });
      sourceRef.current = es;

      es.onmessage = (e) => {
        if (!e.data || e.data.trim() === '') return;
        try {
          const event: RealtimeEvent = JSON.parse(e.data);
          if (event.organizationId === activeOrgId) {
            onEvent(event);
          }
        } catch {
          // malformed event — ignore
        }
      };

      es.onopen = () => { retryRef.current = 0; };

      es.onerror = () => {
        es.close();
        const delay = Math.min(1000 * 2 ** retryRef.current, 30_000);
        retryRef.current++;
        setTimeout(connect, delay);
      };
    };

    connect();
    return () => { sourceRef.current?.close(); };
  }, [activeOrgId, onEvent]);
}
