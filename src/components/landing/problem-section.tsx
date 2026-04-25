import { X, Check } from '@phosphor-icons/react/dist/ssr'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/reveal'

export function ProblemSection() {
  const t = useTranslations('landing.problem')
  const beforeItems = t.raw('beforeItems') as string[]
  const afterItems = t.raw('afterItems') as string[]

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-destructive">
            {t('badge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('description')}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2">
          <Reveal
            variant="left"
            delay={80}
            className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-6 transition-shadow hover:shadow-md sm:p-8"
          >
            <p className="text-sm font-semibold text-destructive">{t('beforeLabel')}</p>
            <ul className="mt-5 space-y-4">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X
                    size={16}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-destructive/60"
                  />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            variant="right"
            delay={160}
            className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 sm:p-8"
          >
            <p className="text-sm font-semibold text-primary">{t('afterLabel')}</p>
            <ul className="mt-5 space-y-4">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={16}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
