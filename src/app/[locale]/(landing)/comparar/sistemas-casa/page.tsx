import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

type ComparisonRow = {
  feature: string
  aduvanta: boolean | string
  casa: boolean | string
}

const comparisons: Record<string, ComparisonRow[]> = {
  'en-US': [
    {
      feature: 'Unified web platform',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Number of separate apps',
      aduvanta: '1 platform',
      casa: '13 desktop apps',
    },
    {
      feature: '100% cloud — zero installation',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Multi-tenant architecture',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Automatic updates',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Built-in client portal',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Comprehensive audit logging',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Role-based access control (RBAC)',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Works on Mac, Windows, mobile',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Real-time multi-user collaboration',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Encrypted data at rest and in transit',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Automated daily backups',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'API access for integrations',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'TIGIE tariff classification',
      aduvanta: true,
      casa: true,
    },
    {
      feature: 'Pedimentos',
      aduvanta: true,
      casa: true,
    },
    {
      feature: 'Anexo 22 catalogs',
      aduvanta: true,
      casa: true,
    },
  ],
  'es-MX': [
    {
      feature: 'Plataforma web unificada',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Numero de aplicaciones separadas',
      aduvanta: '1 plataforma',
      casa: '13 apps de escritorio',
    },
    {
      feature: '100% nube — cero instalacion',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Arquitectura multi-inquilino',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Actualizaciones automaticas',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Portal de clientes integrado',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Registro completo de auditoria',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Control de acceso por roles (RBAC)',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Funciona en Mac, Windows, movil',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Colaboracion multi-usuario en tiempo real',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Datos encriptados en reposo y en transito',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Respaldos automaticos diarios',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Acceso a API para integraciones',
      aduvanta: true,
      casa: false,
    },
    {
      feature: 'Clasificacion arancelaria TIGIE',
      aduvanta: true,
      casa: true,
    },
    {
      feature: 'Pedimentos',
      aduvanta: true,
      casa: true,
    },
    {
      feature: 'Catalogos Anexo 22',
      aduvanta: true,
      casa: true,
    },
  ],
}

const labels = {
  'en-US': {
    title: 'Aduvanta vs Sistemas CASA — Customs Software Comparison',
    heading: 'Aduvanta vs Sistemas CASA',
    subheading:
      'See how a unified cloud platform compares to 13 separate desktop applications.',
    introTitle: 'Why agencies are switching from CASA',
    introBody:
      'Sistemas CASA has been a staple of the Mexican customs industry for decades, offering a suite of 13 separate Windows desktop applications. But the industry has evolved — agencies need real-time collaboration, cloud access, client portals, and modern security. Aduvanta delivers all of this in a single platform.',
    tableFeature: 'Feature',
    summaryTitle: 'The bottom line',
    summaryItems: [
      {
        heading: '13 apps vs 1 platform',
        body: 'CASA requires installing and managing 13 separate Windows applications. Aduvanta runs entirely in the browser — one login, one platform, all modules.',
      },
      {
        heading: 'Local installation vs cloud',
        body: 'CASA must be installed on each workstation and updated manually. Aduvanta is 100% cloud — access it from anywhere, on any device, always up to date.',
      },
      {
        heading: 'Single-tenant vs multi-tenant',
        body: 'CASA operates as isolated local installations. Aduvanta is multi-tenant from day one — manage multiple organizations, clients, and teams from a single account.',
      },
      {
        heading: 'Limited audit trail vs comprehensive logging',
        body: 'CASA provides basic operation records. Aduvanta logs every sensitive action with full context: who did what, when, and from where.',
      },
      {
        heading: 'No client portal vs built-in portal',
        body: 'CASA has no way for your clients to check their operation status. Aduvanta includes a client portal where your clients can track their pedimentos and documents in real time.',
      },
    ],
    ctaHeading: 'Ready to upgrade from CASA?',
    ctaBody:
      'Start your 14-day free trial. We offer guided data migration for Professional and Enterprise plans.',
    ctaButton: 'Start free trial',
    ctaPricing: 'View pricing',
  },
  'es-MX': {
    title: 'Aduvanta vs Sistemas CASA — Comparacion de Software Aduanal',
    heading: 'Aduvanta vs Sistemas CASA',
    subheading:
      'Compara una plataforma unificada en la nube contra 13 aplicaciones de escritorio separadas.',
    introTitle: 'Por que las agencias estan cambiando de CASA',
    introBody:
      'Sistemas CASA ha sido un pilar de la industria aduanal mexicana por decadas, ofreciendo un conjunto de 13 aplicaciones de escritorio para Windows. Pero la industria ha evolucionado — las agencias necesitan colaboracion en tiempo real, acceso en la nube, portales de clientes y seguridad moderna. Aduvanta ofrece todo esto en una sola plataforma.',
    tableFeature: 'Caracteristica',
    summaryTitle: 'En resumen',
    summaryItems: [
      {
        heading: '13 apps vs 1 plataforma',
        body: 'CASA requiere instalar y gestionar 13 aplicaciones de Windows por separado. Aduvanta funciona completamente en el navegador — un solo inicio de sesion, una plataforma, todos los modulos.',
      },
      {
        heading: 'Instalacion local vs nube',
        body: 'CASA debe instalarse en cada estacion de trabajo y actualizarse manualmente. Aduvanta es 100% nube — accede desde cualquier lugar, en cualquier dispositivo, siempre actualizado.',
      },
      {
        heading: 'Inquilino unico vs multi-inquilino',
        body: 'CASA opera como instalaciones locales aisladas. Aduvanta es multi-inquilino desde el dia uno — gestiona multiples organizaciones, clientes y equipos desde una sola cuenta.',
      },
      {
        heading: 'Auditoria limitada vs registro completo',
        body: 'CASA provee registros basicos de operacion. Aduvanta registra cada accion sensible con contexto completo: quien hizo que, cuando y desde donde.',
      },
      {
        heading: 'Sin portal de clientes vs portal integrado',
        body: 'CASA no tiene manera de que tus clientes consulten el estado de sus operaciones. Aduvanta incluye un portal de clientes donde pueden rastrear sus pedimentos y documentos en tiempo real.',
      },
    ],
    ctaHeading: 'Listo para actualizar desde CASA?',
    ctaBody:
      'Inicia tu prueba gratis de 14 dias. Ofrecemos migracion guiada de datos para planes Professional y Enterprise.',
    ctaButton: 'Iniciar prueba gratis',
    ctaPricing: 'Ver precios',
  },
} as const

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm">{value}</span>
  }
  if (value) {
    return (
      <svg
        className="mx-auto h-5 w-5 text-green-600 dark:text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    )
  }
  return (
    <svg
      className="mx-auto h-5 w-5 text-red-500 dark:text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  return buildPageMetadata({
    locale,
    title: isEs
      ? 'Aduvanta vs Sistemas CASA — Comparacion de Software Aduanal'
      : 'Aduvanta vs Sistemas CASA — Customs Software Comparison',
    description: isEs
      ? 'Compara Aduvanta vs Sistemas CASA. Una plataforma web unificada contra 13 aplicaciones de escritorio. Descubre por que las agencias aduanales estan cambiando.'
      : 'Compare Aduvanta vs Sistemas CASA. One unified web platform vs 13 desktop apps. See why customs agencies are switching.',
    path: '/comparar/sistemas-casa',
    keywords:
      'aduvanta vs sistemas casa, comparar software aduanal, alternativa sistemas casa',
  })
}

export default async function CompararSistemasCasaPage({ params }: Props) {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  const t = isEs ? labels['es-MX'] : labels['en-US']
  const rows = isEs ? comparisons['es-MX'] : comparisons['en-US']

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    {
      name: isEs ? 'Comparar' : 'Compare',
      url: `${BASE_URL}/${locale}/comparar`,
    },
    {
      name: 'Sistemas CASA',
      url: `${BASE_URL}/${locale}/comparar/sistemas-casa`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {t.subheading}
        </p>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="text-2xl font-bold tracking-tight">{t.introTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {t.introBody}
        </p>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-4 text-sm font-semibold">
                  {t.tableFeature}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Aduvanta
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Sistemas CASA
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                >
                  <td className="px-6 py-3 text-sm">{row.feature}</td>
                  <td className="px-6 py-3 text-center">
                    <CellValue value={row.aduvanta} />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <CellValue value={row.casa} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary points */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-2xl font-bold tracking-tight">
          {t.summaryTitle}
        </h2>
        <div className="mt-8 space-y-8">
          {t.summaryItems.map((item) => (
            <div key={item.heading}>
              <h3 className="text-lg font-semibold">{item.heading}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50 px-6 py-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.ctaHeading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {t.ctaBody}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {t.ctaButton}
          </Link>
          <Link
            href="/precios"
            className="inline-block rounded-lg border border-border px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {t.ctaPricing}
          </Link>
        </div>
      </section>
    </>
  )
}
