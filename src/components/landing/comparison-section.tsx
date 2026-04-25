import { X, Check } from '@phosphor-icons/react/dist/ssr'
import { useTranslations } from 'next-intl'

type ComparisonRow = {
  feature: string
  legacy: boolean
  aduvanta: boolean
}

export function ComparisonSection() {
  const t = useTranslations('landing.comparison')
  const rows = t.raw('rows') as ComparisonRow[]

  return (
    <section id="compare" className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t('badge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-border/60 sm:mt-16">
          <div className="grid grid-cols-[1fr_80px_80px] items-center gap-0 border-b border-border/60 bg-muted/40 px-5 py-3 sm:grid-cols-[1fr_140px_140px] sm:px-6">
            <div />
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('legacy')}
            </p>
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary">
              {t('aduvanta')}
            </p>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_80px_80px] items-center gap-0 px-5 py-3 sm:grid-cols-[1fr_140px_140px] sm:px-6 ${
                i < rows.length - 1 ? 'border-b border-border/30' : ''
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
          {t('footer')}
        </p>
      </div>
    </section>
  )
}
