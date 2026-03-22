'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackSessionStart, trackPageView } from '@/lib/analytics';

/**
 * Invisible component that tracks session start and page views.
 * Mount once in the authenticated layout.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionTracked = useRef(false);
  const previousPathname = useRef<string | null>(null);

  // Track session start once
  useEffect(() => {
    if (!sessionTracked.current) {
      sessionTracked.current = true;
      trackSessionStart();
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname && pathname !== previousPathname.current) {
      previousPathname.current = pathname;
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
