import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    title: 'TIGIE Tariff Classification — Tariff Code Lookup',
    description:
      'Look up tariff codes, duty rates, and regulations using Aduvanta\'s integrated TIGIE database. Accurate classification linked directly to your customs declarations.',
    hero: {
      heading: 'Tariff Classification with TIGIE Integration',
      subheading:
        'The TIGIE (Tarifa de la Ley de los Impuestos Generales de Importacion y de Exportacion) is Mexico\'s official tariff schedule. Aduvanta provides a complete, searchable TIGIE database so you can classify goods accurately and link classifications directly to pedimentos.',
    },
    features: [
      {
        title: 'Complete TIGIE Database',
        description:
          'Access the full Mexican tariff schedule with chapters, headings, subheadings, and tariff fractions. Search by code, description, or keyword. The database is kept up to date with official SAT publications.',
      },
      {
        title: 'Duty Rates and Regulations',
        description:
          'View import and export duty rates, applicable taxes (IGI, DTA, IVA), regulatory notes, and supplementary units for each tariff fraction. All the information you need for accurate cost calculations in one place.',
      },
      {
        title: 'Classification Notes and Rules',
        description:
          'Access section notes, chapter notes, and general interpretation rules directly within the platform. These references help ensure consistent and defensible classification decisions across your team.',
      },
      {
        title: 'Linked to Pedimentos',
        description:
          'When you classify a product, the tariff fraction flows directly into your pedimento. Duty rates, regulatory requirements, and applicable restrictions are applied automatically, reducing manual entry and classification errors.',
      },
    ],
    cta: {
      heading: 'Classify with confidence',
      description:
        'Create your free account and explore the TIGIE database integrated into Aduvanta.',
      button: 'Get Started',
    },
  },
  'es-MX': {
    title: 'Clasificacion Arancelaria TIGIE — Consulta de Fracciones Arancelarias',
    description:
      'Consulte fracciones arancelarias, tasas de arancel y regulaciones usando la base de datos TIGIE integrada de Aduvanta. Clasificacion precisa vinculada directamente a sus pedimentos.',
    hero: {
      heading: 'Clasificacion Arancelaria con Integracion TIGIE',
      subheading:
        'La TIGIE (Tarifa de la Ley de los Impuestos Generales de Importacion y de Exportacion) es el arancel oficial de Mexico. Aduvanta ofrece una base de datos TIGIE completa y consultable para que clasifique mercancias con precision y vincule las clasificaciones directamente a los pedimentos.',
    },
    features: [
      {
        title: 'Base de Datos TIGIE Completa',
        description:
          'Acceda al arancel mexicano completo con capitulos, partidas, subpartidas y fracciones arancelarias. Busque por codigo, descripcion o palabra clave. La base de datos se mantiene actualizada con las publicaciones oficiales del SAT.',
      },
      {
        title: 'Tasas de Arancel y Regulaciones',
        description:
          'Consulte tasas de arancel de importacion y exportacion, impuestos aplicables (IGI, DTA, IVA), notas regulatorias y unidades complementarias para cada fraccion arancelaria. Toda la informacion necesaria para calculos de costos precisos en un solo lugar.',
      },
      {
        title: 'Notas de Clasificacion y Reglas',
        description:
          'Acceda a notas de seccion, notas de capitulo y reglas generales de interpretacion directamente dentro de la plataforma. Estas referencias ayudan a garantizar decisiones de clasificacion consistentes y defendibles en todo su equipo.',
      },
      {
        title: 'Vinculado a Pedimentos',
        description:
          'Cuando clasifica un producto, la fraccion arancelaria fluye directamente a su pedimento. Las tasas de arancel, requisitos regulatorios y restricciones aplicables se aplican automaticamente, reduciendo la captura manual y los errores de clasificacion.',
      },
    ],
    cta: {
      heading: 'Clasifique con confianza',
      description:
        'Cree su cuenta gratuita y explore la base de datos TIGIE integrada en Aduvanta.',
      button: 'Comenzar',
    },
  },
} as const

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  return buildPageMetadata({
    locale,
    title: isEs
      ? 'Clasificacion Arancelaria TIGIE — Consulta de Fracciones Arancelarias'
      : 'TIGIE Tariff Classification — Tariff Code Lookup',
    description: isEs
      ? 'Consulte fracciones arancelarias, tasas de arancel y regulaciones con la base de datos TIGIE integrada de Aduvanta. Clasificacion arancelaria precisa para pedimentos.'
      : 'Look up tariff codes, duty rates, and regulations with Aduvanta\'s integrated TIGIE database. Accurate tariff classification for customs declarations.',
    path: '/clasificacion-arancelaria',
    keywords: isEs
      ? 'clasificacion arancelaria, TIGIE, fracciones arancelarias, arancel de importacion, arancel de exportacion, consulta arancelaria'
      : 'tariff classification, TIGIE, tariff codes Mexico, customs tariff lookup, harmonized system Mexico, duty rates',
  })
}

export default async function ClasificacionArancelariaPage({ params }: Props) {
  const { locale } = await params
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t.title, url: `${BASE_URL}/${locale}/clasificacion-arancelaria` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t.hero.heading}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {t.hero.subheading}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 sm:grid-cols-2">
          {t.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-card p-8"
            >
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-2xl bg-muted/50 p-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.cta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.cta.description}
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>
    </>
  )
}
