'use client';

import { useState } from 'react';
import { useActiveAnnouncements } from '@/features/system-admin/hooks/use-system-admin';
import { X, Info, Warning, XCircle } from '@phosphor-icons/react';

const LEVEL_STYLES = {
  INFO: {
    wrapper: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    icon: Info,
    iconClass: 'text-blue-500',
  },
  WARNING: {
    wrapper: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: Warning,
    iconClass: 'text-yellow-500',
  },
  CRITICAL: {
    wrapper: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
    text: 'text-red-800 dark:text-red-200',
    icon: XCircle,
    iconClass: 'text-red-500',
  },
};

export function AnnouncementBanner() {
  const { data: announcements = [] } = useActiveAnnouncements();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-0">
      {visible.map((a) => {
        const styles = LEVEL_STYLES[a.level] ?? LEVEL_STYLES.INFO;
        const Icon = styles.icon;
        return (
          <div
            key={a.id}
            className={`flex items-start gap-3 border-b px-4 py-2.5 ${styles.wrapper}`}
          >
            <Icon size={15} className={`${styles.iconClass} mt-0.5 shrink-0`} weight="fill" />
            <div className={`flex-1 min-w-0 text-sm ${styles.text}`}>
              <span className="font-semibold">{a.title}</span>
              {a.body && <span className="ml-2 opacity-80">{a.body}</span>}
            </div>
            <button
              type="button"
              onClick={() => setDismissed((s) => new Set([...s, a.id]))}
              className={`shrink-0 rounded p-0.5 hover:bg-black/10 transition-colors ${styles.text}`}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
