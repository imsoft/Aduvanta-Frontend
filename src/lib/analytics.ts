'use client';

import { apiClient } from './api-client';

type EventCategory =
  | 'auth'
  | 'onboarding'
  | 'product'
  | 'engagement'
  | 'monetization';

interface TrackPayload {
  category: EventCategory;
  eventName: string;
  properties?: Record<string, unknown>;
  numericValue?: number;
}

// --- Session ID (persists per browser tab) ---

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

// --- Event buffer for batching ---

interface BufferedEvent {
  eventId: string;
  sessionId: string;
  category: EventCategory;
  eventName: string;
  properties?: Record<string, unknown>;
  pageUrl: string;
  referrer: string;
  numericValue?: number;
  occurredAt: string;
}

const buffer: BufferedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL_MS = 3_000;
const MAX_BATCH_SIZE = 20;

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushEvents();
  }, FLUSH_INTERVAL_MS);
}

async function flushEvents(): Promise<void> {
  if (buffer.length === 0) return;

  const batch = buffer.splice(0, MAX_BATCH_SIZE);

  try {
    await apiClient.post('/api/events/track/batch', { events: batch });
  } catch {
    // Analytics should never break the app — drop silently
  }

  // If there are remaining events, schedule another flush
  if (buffer.length > 0) {
    scheduleFlush();
  }
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      void flushEvents();
    }
  });
}

// --- Public API ---

/**
 * Track a product event. Batched and sent async.
 * Never throws — safe to call anywhere.
 */
export function track(payload: TrackPayload): void {
  try {
    const event: BufferedEvent = {
      eventId: crypto.randomUUID(),
      sessionId: getSessionId(),
      category: payload.category,
      eventName: payload.eventName,
      properties: payload.properties,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      numericValue: payload.numericValue,
      occurredAt: new Date().toISOString(),
    };

    buffer.push(event);

    if (buffer.length >= MAX_BATCH_SIZE) {
      void flushEvents();
    } else {
      scheduleFlush();
    }
  } catch {
    // Never throw from analytics
  }
}

/**
 * Track a page view. Call from route change handlers.
 */
export function trackPageView(path: string): void {
  track({
    category: 'engagement',
    eventName: 'page.viewed',
    properties: { path },
  });
}

/**
 * Track feature usage. Call when users interact with product features.
 */
export function trackFeature(featureName: string, metadata?: Record<string, unknown>): void {
  track({
    category: 'engagement',
    eventName: 'feature.used',
    properties: { feature: featureName, ...metadata },
  });
}

/**
 * Track session start. Call once on app load.
 */
export function trackSessionStart(): void {
  track({
    category: 'engagement',
    eventName: 'session.started',
    properties: {
      screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
}
