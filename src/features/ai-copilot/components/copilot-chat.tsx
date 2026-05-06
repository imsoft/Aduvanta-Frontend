'use client';

import { useEffect, useRef, useState } from 'react';
import { useOrgStore } from '@/store/org.store';
import { copilotApi, type CopilotMessage } from '../api/copilot.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperPlaneRight, Robot } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CopilotChat() {
  const { activeOrgId } = useOrgStore();
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!activeOrgId || !input.trim() || loading) return;
    const userMsg: CopilotMessage = { role: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await copilotApi.sendMessage(activeOrgId, input, sessionId);
      setSessionId(res.sessionId);
      setMessages(res.history);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al consultar el copilot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 p-4 border mb-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Robot size={32} className="mb-2" />
            <p className="text-sm font-medium">AI Copilot de Comercio Exterior</p>
            <p className="text-xs mt-1">Pregunta sobre fracciones, regímenes, NOM, TLCs, Incoterms…</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'max-w-[85%] p-3 text-sm',
              msg.role === 'user'
                ? 'ml-auto bg-primary text-primary-foreground'
                : 'mr-auto bg-muted',
            )}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-muted p-3 text-sm text-muted-foreground animate-pulse">
            Consultando…
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="¿Qué fracción aplica para…?"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
        />
        <Button onClick={send} disabled={loading || !input.trim()} size="icon">
          <PaperPlaneRight size={16} />
        </Button>
      </div>
    </div>
  );
}
