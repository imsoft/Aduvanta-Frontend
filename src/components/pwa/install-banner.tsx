'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from '@phosphor-icons/react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pwa-banner-dismissed');
    if (stored) { setDismissed(true); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt || dismissed) return null;

  const install = async () => {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') {
      setPrompt(null);
    }
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', '1');
  };

  const dismiss = () => {
    setDismissed(true);
    setPrompt(null);
    localStorage.setItem('pwa-banner-dismissed', '1');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 border bg-background p-3 shadow-lg sm:left-auto sm:w-80">
      <div className="flex items-center gap-2 text-sm">
        <Download size={16} className="shrink-0 text-primary" />
        <span>Instala Aduvanta como app</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={install}>Instalar</Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={dismiss}>
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}
