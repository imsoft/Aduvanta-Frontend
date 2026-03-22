import { X, Check } from '@phosphor-icons/react/dist/ssr'

type ComparisonRow = {
  feature: string
  legacy: boolean
  aduvanta: boolean
}

const content = {
  'en-US': {
    badge: 'Compare',
    title: 'Competition vs. Aduvanta',
    legacy: 'Competition',
    aduvanta: 'Aduvanta',
    rows: [
      { feature: 'Web-based — no installation', legacy: false, aduvanta: true },
      { feature: 'Access from any device', legacy: false, aduvanta: true },
      { feature: 'Client portal included', legacy: false, aduvanta: true },
      { feature: 'AI-powered classification', legacy: false, aduvanta: true },
      { feature: 'Real-time collaboration', legacy: false, aduvanta: true },
      { feature: 'Full audit trail', legacy: false, aduvanta: true },
      { feature: 'Multi-organization support', legacy: false, aduvanta: true },
      { feature: 'API for integrations', legacy: false, aduvanta: true },
      { feature: 'Pedimento management', legacy: true, aduvanta: true },
      { feature: 'Tariff classification', legacy: true, aduvanta: true },
      { feature: 'Automatic updates', legacy: false, aduvanta: true },
      { feature: 'Unified billing & treasury', legacy: false, aduvanta: true },
    ] satisfies ComparisonRow[],
    footer: 'Same core functionality. A completely different experience.',
  },
  'es-MX': {
    badge: 'Comparar',
    title: 'Competencia vs. Aduvanta',
    legacy: 'Competencia',
    aduvanta: 'Aduvanta',
    rows: [
      { feature: 'Basado en web — sin instalacion', legacy: false, aduvanta: true },
      { feature: 'Acceso desde cualquier dispositivo', legacy: false, aduvanta: true },
      { feature: 'Portal de clientes incluido', legacy: false, aduvanta: true },
      { feature: 'Clasificacion con IA', legacy: false, aduvanta: true },
      { feature: 'Colaboracion en tiempo real', legacy: false, aduvanta: true },
      { feature: 'Auditoria completa', legacy: false, aduvanta: true },
      { feature: 'Soporte multi-organizacion', legacy: false, aduvanta: true },
      { feature: 'API para integraciones', legacy: false, aduvanta: true },
      { feature: 'Gestion de pedimentos', legacy: true, aduvanta: true },
      { feature: 'Clasificacion arancelaria', legacy: true, aduvanta: true },
      { feature: 'Actualizaciones automaticas', legacy: false, aduvanta: true },
      { feature: 'Facturacion y tesoreria unificada', legacy: false, aduvanta: true },
    ] satisfies ComparisonRow[],
    footer: 'La misma funcionalidad base. Una experiencia completamente diferente.',
  },
} as const

type Props = {
  locale: string
}

export function ComparisonSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section id="compare" className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.badge}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-border/60 sm:mt-16">
          <div className="grid grid-cols-[1fr_80px_80px] items-center gap-0 border-b border-border/60 bg-muted/40 px-5 py-3 sm:grid-cols-[1fr_140px_140px] sm:px-6">
            <div />
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.legacy}
            </p>
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary">
              {t.aduvanta}
            </p>
          </div>

          {t.rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_80px_80px] items-center gap-0 px-5 py-3 sm:grid-cols-[1fr_140px_140px] sm:px-6 ${
                i < t.rows.length - 1 ? 'border-b border-border/30' : ''
              }`}
            >
              <span className="text-sm text-foreground">{row.feature}</span>
              <div className="flex justify-center">
                {row.legacy ? (
                  <Check size={16} weight="bold" className="text-muted-foreground/50" />
                ) : (
                  <X size={16} weight="bold" className="text-muted-foreground/30" />
                )}
              </div>
              <div className="flex justify-center">
                <Check size={16} weight="bold" className="text-primary" />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.footer}
        </p>
      </div>
    </section>
  )
}
