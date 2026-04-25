import { ArrowRight, Play, Sparkle } from '@phosphor-icons/react/dist/ssr'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { HeroVideo } from '@/components/landing/hero-video'

type Stat = {
  value: string
  label: string
}

export function HeroSection() {
  const t = useTranslations('landing.hero')
  const stats = t.raw('stats') as Stat[]

  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="animate-aurora absolute -top-40 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div
          className="animate-aurora absolute -top-20 right-[-10%] h-[520px] w-[520px] rounded-full bg-chart-2/15 blur-3xl"
          style={{ animationDelay: '-8s' }}
        />
        <div
          className="animate-aurora absolute top-[40%] left-[-10%] h-[520px] w-[520px] rounded-full bg-chart-1/12 blur-3xl"
          style={{ animationDelay: '-14s' }}
        />
        <div
          className="absolute inset-0 opacity-35 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkle size={12} weight="fill" className="text-primary" />
            {t('eyebrow')}
          </div>

          <h1 className="animate-fade-up reveal-delay-1 mt-5 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {t('headline')}
            <br />
            <span className="animate-gradient bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              {t('headlineAccent')}
            </span>
          </h1>

          <p className="animate-fade-up reveal-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            {t('subheadline')}
          </p>

          <div className="animate-fade-up reveal-delay-3 mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/sign-up"
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              <span
                aria-hidden="true"
                className="animate-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              <span className="relative">{t('cta')}</span>
              <ArrowRight
                size={16}
                weight="bold"
                className="relative transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#demo"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-muted sm:w-auto"
            >
              <Play
                size={14}
                weight="fill"
                className="text-primary transition-transform group-hover:scale-110"
              />
              {t('ctaSecondary')}
            </a>
          </div>

          <p className="animate-fade-up reveal-delay-4 mt-3 text-xs text-muted-foreground">
            {t('noCard')}
          </p>
        </div>

        <div className="animate-fade-up reveal-delay-4 mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-border/50 sm:mt-16">
          {stats.map((stat, i) => (
            <div key={stat.label} className="px-4 text-center sm:px-8">
              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                <AnimatedCounter value={stat.value} durationMs={1200 + i * 200} />
              </p>
              <p className="mt-1 text-xs leading-tight text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div
          id="demo"
          className="animate-scale-in reveal-delay-5 mx-auto mt-14 max-w-4xl scroll-mt-24 sm:mt-16"
        >
          <HeroVideo
            sources={[{ src: '/videos/landing/demo.mp4', type: 'video/mp4' }]}
            poster="/videos/landing/demo-poster.jpg"
            posterAlt={t('posterAlt')}
            playLabel={t('playLabel')}
            caption={t('playCaption')}
          />
        </div>
      </div>
    </section>
  )
}
