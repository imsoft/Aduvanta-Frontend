'use client';

import { useState } from 'react';
import { useOrgStore } from '@/store/org.store';
import { tariffClassifierApi, type TariffClassificationResult } from '../api/tariff-classifier.api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkle, ArrowClockwise } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function TariffClassifierWidget() {
  const { activeOrgId } = useOrgStore();
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<TariffClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const classify = async () => {
    if (!activeOrgId || !description.trim()) return;
    setLoading(true);
    try {
      const res = await tariffClassifierApi.classify(activeOrgId, description);
      setResult(res);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al clasificar');
    } finally {
      setLoading(false);
    }
  };

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;
  const confidenceColor =
    confidencePct >= 80 ? 'text-green-700' : confidencePct >= 50 ? 'text-yellow-700' : 'text-red-700';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Describe la mercancía: materiales, uso, características técnicas, origen... (ej. Laptop de 15 pulgadas con procesador Intel i7, 16GB RAM, para uso empresarial)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <Button
          onClick={classify}
          disabled={loading || !description.trim() || !activeOrgId}
          className="gap-2"
        >
          {loading ? (
            <ArrowClockwise size={14} className="animate-spin" />
          ) : (
            <Sparkle size={14} />
          )}
          {loading ? 'Clasificando…' : 'Clasificar con IA'}
        </Button>
      </div>

      {result && (
        <div className="border p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Fracción recomendada</p>
              <p className="text-2xl font-mono font-semibold mt-0.5">{result.fraction}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Confianza</p>
              <p className={`text-2xl font-semibold ${confidenceColor}`}>{confidencePct}%</p>
              {result.cached && <p className="text-xs text-muted-foreground">caché</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="border p-2">
              <p className="text-xs text-muted-foreground">Arancel import.</p>
              <p className="font-mono font-medium">{result.importTariff ?? '—'}</p>
            </div>
            <div className="border p-2">
              <p className="text-xs text-muted-foreground">Arancel export.</p>
              <p className="font-mono font-medium">{result.exportTariff ?? '—'}</p>
            </div>
            <div className="border p-2">
              <p className="text-xs text-muted-foreground">IVA</p>
              <p className="font-mono font-medium">{result.vatRate ?? '—'}</p>
            </div>
          </div>

          {result.reasoning && (
            <div className="bg-muted/40 p-3 text-sm">
              <p className="text-xs text-muted-foreground mb-1">Razonamiento</p>
              <p>{result.reasoning}</p>
            </div>
          )}

          {result.alternatives.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Fracciones alternativas</p>
              <div className="flex flex-wrap gap-2">
                {result.alternatives.map((alt) => (
                  <Badge key={alt.fraction} variant="outline" className="font-mono text-xs">
                    {alt.fraction} ({Math.round(alt.confidence * 100)}%)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
