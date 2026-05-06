'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TariffClassifierWidget } from '@/features/ai-tariff/components/tariff-classifier-widget';
import { CopilotChat } from '@/features/ai-copilot/components/copilot-chat';

export default function AiPage() {
  const t = useTranslations();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Copilot</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Clasificación arancelaria automática y asistente de comercio exterior
        </p>
      </div>

      <Tabs defaultValue="classifier">
        <TabsList>
          <TabsTrigger value="classifier">Clasificación Arancelaria</TabsTrigger>
          <TabsTrigger value="copilot">Copilot</TabsTrigger>
        </TabsList>
        <TabsContent value="classifier" className="mt-4">
          <div className="border p-6">
            <h2 className="font-medium mb-1">Clasificación con IA</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Describe la mercancía y Gemini AI sugerirá la fracción arancelaria correcta de la TIGIE.
            </p>
            <TariffClassifierWidget />
          </div>
        </TabsContent>
        <TabsContent value="copilot" className="mt-4">
          <div className="border p-6">
            <h2 className="font-medium mb-1">Asistente de Comercio Exterior</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Consulta sobre fracciones, regímenes, NOM, TLCs, Incoterms y más.
            </p>
            <CopilotChat />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
