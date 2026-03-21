import { ArrowRight, Play } from '@phosphor-icons/react/dist/ssr'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    headline: 'Stop fighting your customs software.',
    headlineAccent: 'Start running your operation.',
    subheadline:
      'Aduvanta replaces 13 disconnected desktop apps with one platform. Pedimentos, documents, billing, warehouse, and client portal — all in your browser.',
    cta: 'Start 14-day free trial',
    ctaSecondary: 'Watch 2-min demo',
    noCard: 'No credit card required',
    stats: [
      { value: '80%', label: 'less time on pedimentos' },
      { value: '0', label: 'software to install' },
      { value: '100%', label: 'online, from anywhere' },
    ],
  },
  'es-MX': {
    headline: 'Deja de pelear con tu software aduanal.',
    headlineAccent: 'Empieza a operar de verdad.',
    subheadline:
      'Aduvanta reemplaza 13 apps de escritorio desconectadas con una sola plataforma. Pedimentos, documentos, facturacion, almacen y portal de clientes — todo desde tu navegador.',
    cta: 'Prueba gratis 14 dias',
    ctaSecondary: 'Ver demo de 2 min',
    noCard: 'Sin tarjeta de credito',
    stats: [
      { value: '80%', label: 'menos tiempo en pedimentos' },
      { value: '0', label: 'software que instalar' },
      { value: '100%', label: 'en linea, desde cualquier lugar' },
    ],
  },
} as const

type Props = {
  locale: string
}

export function HeroSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-24">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {t.headline}
            <br />
            <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              {t.headlineAccent}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            {t.subheadline}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/sign-up"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              {t.cta}
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#demo"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted sm:w-auto"
            >
              <Play size={14} weight="fill" className="text-primary" />
              {t.ctaSecondary}
            </a>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">{t.noCard}</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-border/50 sm:mt-16">
          {t.stats.map((stat) => (
            <div key={stat.label} className="px-4 text-center sm:px-8">
              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-tight text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-4xl sm:mt-16">
          <div className="aspect-video overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted shadow-2xl">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Play size={24} weight="fill" className="ml-0.5 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {locale === 'es-MX' ? 'Vista previa de la plataforma' : 'Platform preview'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
