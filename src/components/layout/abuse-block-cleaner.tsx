'use client';

import { useEffect, useRef } from 'react';
import { systemAdminApi } from '@/features/system-admin/api/system-admin.api';

/**
 * Silently clears any lingering abuse-detection block for the current user
 * once per session on dashboard mount. Safe no-op if the user isn't blocked.
 *
 * Background: RBAC 403 responses were previously counted as abuse signals,
 * causing false-positive blocks. This ensures recovery without user action.
 */
export function AbuseBlockCleaner() {
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    void systemAdminApi.clearMyAbuseBlock().catch(() => {
      // Non-critical — silently ignore if the endpoint fails
    });
  }, []);

  return null;
}
