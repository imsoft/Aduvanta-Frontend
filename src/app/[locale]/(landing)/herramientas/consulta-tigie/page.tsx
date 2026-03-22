import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'

const content = {
  'en-US': {
    title: 'Free TIGIE Tariff Lookup Tool',
    subtitle:
      'Search the Mexican TIGIE tariff schedule by fraction, description, or keyword. Find duty rates, regulations, and applicable notes instantly.',
    searchPlaceholder: 'Search by tariff fraction or keyword (e.g. 8471.30 or "laptops")...',
    searchButton: 'Search TIGIE',
    features: [
      {
        title: 'Complete TIGIE Database',
        description:
          'Access the full Tarifa de la Ley de los Impuestos Generales de Importacion y de Exportacion. Over 12,000 tariff fractions with duty rates, units of measure, and supplementary notes.',
      },
      {
        title: 'Duty Rates & Regulations',
        description:
          'View import and export duty rates (ad valorem, specific, mixed), applicable regulations (NOMs, permits, quotas), and restricted merchandise flags for each fraction.',
      },
      {
        title: 'Anexo 22 Integration',
        description:
          'Cross-reference tariff fractions with Anexo 22 catalogs including units of measure, customs offices, country codes, and NICO codes — all in one place.',
      },
      {
        title: 'Always Up to Date',
        description:
          'Our TIGIE database is synchronized with official SAT publications. When tariff fractions change, our database reflects it automatically.',
      },
    ],
    ctaTitle: 'Need more than lookups?',
    ctaDescription:
      'Aduvanta integrates TIGIE classification directly into pedimento creation. AI-assisted suggestions, automatic validation, and full audit trail.',
    ctaCta: 'Try Aduvanta free for 14 days',
    signUpNote: 'Full TIGIE lookup available after free sign-up. No credit card required.',
  },
  'es-MX': {
    title: 'Herramienta Gratuita de Consulta TIGIE',
    subtitle:
      'Busca en la tarifa TIGIE de Mexico por fraccion arancelaria, descripcion o palabra clave. Encuentra tasas arancelarias, regulaciones y notas aplicables al instante.',
    searchPlaceholder: 'Busca por fraccion arancelaria o palabra clave (ej. 8471.30 o "laptops")...',
    searchButton: 'Buscar TIGIE',
    features: [
      {
        title: 'Base de Datos TIGIE Completa',
        description:
          'Accede a la Tarifa de la Ley de los Impuestos Generales de Importacion y de Exportacion completa. Mas de 12,000 fracciones arancelarias con tasas, unidades de medida y notas complementarias.',
      },
      {
        title: 'Tasas Arancelarias y Regulaciones',
        description:
          'Consulta tasas de importacion y exportacion (ad valorem, especificas, mixtas), regulaciones aplicables (NOMs, permisos, cupos) y mercancias restringidas para cada fraccion.',
      },
      {
        title: 'Integracion con Anexo 22',
        description:
          'Cruza fracciones arancelarias con catalogos del Anexo 22 incluyendo unidades de medida, aduanas, codigos de pais y codigos NICO — todo en un solo lugar.',
      },
      {
        title: 'Siempre Actualizado',
        description:
          'Nuestra base de datos TIGIE esta sincronizada con publicaciones oficiales del SAT. Cuando cambian las fracciones arancelarias, nuestra base lo refleja automaticamente.',
      },
    ],
    ctaTitle: 'Necesitas mas que solo consultas?',
    ctaDescription:
      'Aduvanta integra la clasificacion TIGIE directamente en la creacion de pedimentos. Sugerencias con IA, validacion automatica y auditoria completa.',
    ctaCta: 'Prueba Aduvanta gratis 14 dias',
    signUpNote: 'Consulta TIGIE completa disponible con registro gratuito. Sin tarjeta de credito.',
  },
} as const

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  return buildPageMetadata({
    locale,
    title: isEs
      ? 'Consulta TIGIE Gratis — Fracciones Arancelarias Mexico'
      : 'Free TIGIE Lookup — Mexican Tariff Fractions',
    description: isEs
      ? 'Consulta gratuita de fracciones arancelarias TIGIE. Busca tasas de importacion, exportacion, regulaciones y notas complementarias de la tarifa arancelaria de Mexico.'
      : 'Free TIGIE tariff fraction lookup. Search Mexican import and export duty rates, regulations, and supplementary notes from the official tariff schedule.',
    path: '/herramientas/consulta-tigie',
    keywords: isEs
      ? 'consulta TIGIE, fracciones arancelarias, tarifa arancelaria Mexico, clasificacion arancelaria, TIGIE consulta gratis'
      : 'TIGIE lookup, Mexican tariff fractions, tariff classification Mexico, TIGIE search, duty rates Mexico',
  })
}

export default async function ConsultaTigiePage({ params }: Props) {
  const { locale } = await params
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    {
      name: locale === 'es-MX' ? 'Herramientas' : 'Tools',
      url: `${BASE_URL}/${locale}/herramientas/consulta-tigie`,
    },
    {
      name: locale === 'es-MX' ? 'Consulta TIGIE' : 'TIGIE Lookup',
      url: `${BASE_URL}/${locale}/herramientas/consulta-tigie`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-lg">
              <MagnifyingGlass size={20} className="ml-2 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
                disabled
              />
              <Link
                href="/sign-up"
                className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.searchButton}
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {t.signUpNote}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {t.features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {t.ctaDescription}
          </p>
          <Link
            href="/sign-up"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {t.ctaCta}
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>
    </>
  )
}
