import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'

export function CtaSection() {
  const t = useTranslations('landing.ctaSection')

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal
          variant="scale"
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-2xl shadow-primary/20 sm:px-12 sm:py-20 lg:px-20"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="animate-aurora absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/8 blur-3xl" />
            <div
              className="animate-aurora absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-chart-2/18 blur-3xl"
              style={{ animationDelay: '-10s' }}
            />
            <div className="absolute inset-0 opacity-8 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          </div>

          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              {t('title')}
              <br />
              <span className="text-primary-foreground/80">{t('subtitle')}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-primary-foreground/70 sm:text-lg">
              {t('description')}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/sign-up"
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white sm:w-auto"
              >
                <span
                  aria-hidden="true"
                  className="animate-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-primary/15 to-transparent"
                />
                <span className="relative">{t('cta')}</span>
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="relative transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="mailto:ventas@aduvanta.com"
                className="w-full rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
              >
                {t('secondary')}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
