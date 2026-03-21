import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ShieldCheck,
  ChartLineUp,
  Globe,
} from '@phosphor-icons/react/dist/ssr'

const content = {
  'en-US': {
    badge: 'The modern customs platform',
    title: 'Customs operations.',
    titleAccent: 'Simplified.',
    description:
      'Aduvanta replaces outdated desktop software with a unified web platform for customs agencies, importers, and exporters. Real-time operations, full traceability, and enterprise-grade security.',
    cta: 'Start Free Trial',
    ctaSecondary: 'See a Demo',
    stat1: 'Faster operations',
    stat2: 'Full traceability',
    stat3: 'Enterprise security',
  },
  'es-MX': {
    badge: 'La plataforma aduanera moderna',
    title: 'Operaciones aduaneras.',
    titleAccent: 'Simplificadas.',
    description:
      'Aduvanta reemplaza el software de escritorio obsoleto con una plataforma web unificada para agencias aduanales, importadores y exportadores. Operaciones en tiempo real, trazabilidad total y seguridad empresarial.',
    cta: 'Prueba Gratuita',
    ctaSecondary: 'Ver Demo',
    stat1: 'Operaciones mas rapidas',
    stat2: 'Trazabilidad completa',
    stat3: 'Seguridad empresarial',
  },
} as const

type Props = {
  locale: string
}

export function HeroSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-chart-2/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-muted-foreground">
              {t.badge}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {t.title}
            <br />
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              {t.titleAccent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            >
              {t.cta}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: ChartLineUp,
              label: t.stat1,
            },
            {
              icon: Globe,
              label: t.stat2,
            },
            {
              icon: ShieldCheck,
              label: t.stat3,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm"
            >
              <stat.icon
                size={20}
                weight="duotone"
                className="shrink-0 text-primary"
              />
              <span className="text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
