import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    title: 'Pedimentos Module — Customs Declaration Software',
    description:
      'Manage customs declarations (pedimentos) with Aduvanta. Auto-validation, SAAI integration, error detection, document attachment, and real-time status tracking — all in one platform.',
    hero: {
      heading: 'Pedimentos Made Simple',
      subheading:
        'A pedimento is the official customs declaration required for every import and export operation in Mexico. Aduvanta streamlines the entire lifecycle — from creation and validation to submission and archival — so your team can focus on operations, not paperwork.',
    },
    features: [
      {
        title: 'Automated Validation',
        description:
          'Every pedimento is validated against SAAI error codes and Anexo 22 rules before submission. Catch data errors, missing fields, and inconsistencies before they reach customs authorities, reducing rejections and costly delays.',
      },
      {
        title: 'SAAI Integration',
        description:
          'Aduvanta is designed to integrate with Mexico\'s SAAI (Automated Customs System). Generate compliant electronic files, track submission status, and receive acknowledgments directly within the platform.',
      },
      {
        title: 'Document Attachment and Management',
        description:
          'Attach invoices, packing lists, certificates of origin, and any required documentation directly to each pedimento. All documents are stored securely in the cloud and linked to their corresponding operations for instant retrieval.',
      },
      {
        title: 'Real-Time Status Tracking',
        description:
          'Track every pedimento through its lifecycle: draft, validated, submitted, paid, and archived. Configurable notifications keep your team and clients informed at every stage.',
      },
    ],
    cta: {
      heading: 'Streamline your pedimentos workflow',
      description:
        'Create your free account and see how Aduvanta simplifies customs declarations.',
      button: 'Get Started',
    },
  },
  'es-MX': {
    title: 'Modulo de Pedimentos — Software para Pedimentos Aduanales',
    description:
      'Gestione pedimentos aduanales con Aduvanta. Validacion automatica, integracion SAAI, deteccion de errores, adjuntos documentales y seguimiento de estatus en tiempo real — todo en una plataforma.',
    hero: {
      heading: 'Pedimentos sin Complicaciones',
      subheading:
        'El pedimento es la declaracion aduanal oficial requerida para cada operacion de importacion y exportacion en Mexico. Aduvanta simplifica todo el ciclo de vida — desde la creacion y validacion hasta la presentacion y archivo — para que su equipo se enfoque en las operaciones, no en el papeleo.',
    },
    features: [
      {
        title: 'Validacion Automatica',
        description:
          'Cada pedimento se valida contra codigos de error del SAAI y reglas del Anexo 22 antes de su presentacion. Detecte errores de datos, campos faltantes e inconsistencias antes de que lleguen a la autoridad aduanera, reduciendo rechazos y retrasos costosos.',
      },
      {
        title: 'Integracion con SAAI',
        description:
          'Aduvanta esta disenado para integrarse con el SAAI (Sistema Automatizado Aduanero Integral) de Mexico. Genere archivos electronicos conformes, rastree el estado de envio y reciba acuses directamente dentro de la plataforma.',
      },
      {
        title: 'Adjuntos y Gestion Documental',
        description:
          'Adjunte facturas, listas de empaque, certificados de origen y cualquier documentacion requerida directamente a cada pedimento. Todos los documentos se almacenan de forma segura en la nube y se vinculan a sus operaciones correspondientes para recuperacion inmediata.',
      },
      {
        title: 'Seguimiento de Estatus en Tiempo Real',
        description:
          'Rastree cada pedimento a lo largo de su ciclo de vida: borrador, validado, presentado, pagado y archivado. Las notificaciones configurables mantienen informados a su equipo y clientes en cada etapa.',
      },
    ],
    cta: {
      heading: 'Simplifique su flujo de pedimentos',
      description:
        'Cree su cuenta gratuita y descubra como Aduvanta simplifica las declaraciones aduanales.',
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
      ? 'Modulo de Pedimentos — Software para Pedimentos Aduanales'
      : 'Pedimentos Module — Customs Declaration Software',
    description: isEs
      ? 'Software para pedimentos aduanales con validacion automatica, integracion SAAI, deteccion de errores y seguimiento en tiempo real. Simplifique sus declaraciones aduanales con Aduvanta.'
      : 'Customs declaration software with auto-validation, SAAI integration, error detection, and real-time tracking. Streamline your pedimentos with Aduvanta.',
    path: '/pedimentos',
    keywords: isEs
      ? 'pedimentos, pedimentos aduanales, software de pedimentos, despacho aduanero, declaracion aduanal, SAAI'
      : 'pedimentos, customs declarations Mexico, customs declaration software, SAAI integration, Mexican customs filing',
  })
}

export default async function PedimentosPage({ params }: Props) {
  const { locale } = await params
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t.title, url: `${BASE_URL}/${locale}/pedimentos` },
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
