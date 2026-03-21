import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    title: 'Ready to modernize your customs operations?',
    description:
      'Join forward-thinking customs agencies that are leaving legacy software behind. Start your free trial today.',
    cta: 'Start Free Trial',
    secondary: 'Talk to Sales',
  },
  'es-MX': {
    title: 'Listo para modernizar tus operaciones aduaneras?',
    description:
      'Unete a las agencias aduanales que estan dejando atras el software legacy. Comienza tu prueba gratuita hoy.',
    cta: 'Prueba Gratuita',
    secondary: 'Hablar con Ventas',
  },
} as const

type Props = {
  locale: string
}

export function CtaSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="border-t border-border/50 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-2xl sm:px-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          </div>

          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            {t.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm transition-all hover:bg-white/90"
            >
              {t.cta}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="mailto:ventas@aduvanta.com"
              className="rounded-xl border border-white/20 px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-white/10"
            >
              {t.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
