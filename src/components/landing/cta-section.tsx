import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    title: 'Modernize your customs agency today.',
    subtitle: 'Start your free trial now.',
    description:
      '14-day free trial. No credit card. No installation. Creating pedimentos in 15 minutes.',
    cta: 'Try Aduvanta free for 14 days',
    secondary: 'Schedule a call',
  },
  'es-MX': {
    title: 'Moderniza tu agencia aduanal hoy.',
    subtitle: 'Empieza tu prueba gratis ahora.',
    description:
      '14 dias gratis. Sin tarjeta de credito. Sin instalacion. Creando pedimentos en 15 minutos.',
    cta: 'Prueba Aduvanta gratis 14 dias',
    secondary: 'Agenda una llamada',
  },
} as const

type Props = {
  locale: string
}

export function CtaSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-2xl shadow-primary/20 sm:px-12 sm:py-20 lg:px-20">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              {t.title}
              <br />
              <span className="text-primary-foreground/80">{t.subtitle}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-primary-foreground/70 sm:text-lg">
              {t.description}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/sign-up"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/95 sm:w-auto"
              >
                {t.cta}
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="mailto:ventas@aduvanta.com"
                className="w-full rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-white/10 sm:w-auto"
              >
                {t.secondary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
