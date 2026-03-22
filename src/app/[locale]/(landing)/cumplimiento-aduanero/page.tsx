import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    title: 'Customs Compliance & Audit — Operations Control',
    description:
      'Ensure regulatory compliance and maintain full audit trails with Aduvanta. Automated validation, error prevention, compliance rules, and immutable audit logs for every customs operation.',
    hero: {
      heading: 'Customs Compliance You Can Rely On',
      subheading:
        'Compliance failures in customs operations lead to fines, delays, and reputational damage. Aduvanta embeds compliance into every workflow — automated validation rules, real-time error detection, and immutable audit logs that give you complete control over your operations.',
    },
    features: [
      {
        title: 'Automated Compliance Rules',
        description:
          'Define and enforce compliance rules that run automatically on every pedimento and customs operation. Rules cover tariff classification accuracy, required documentation, value thresholds, country restrictions, and regulatory requirements. When a rule is violated, the system flags it before submission.',
      },
      {
        title: 'Immutable Audit Trail',
        description:
          'Every action in Aduvanta is logged: who did what, when, and in what context. Audit records are append-only and cannot be modified or deleted. This provides a defensible record for regulatory audits, internal reviews, and dispute resolution.',
      },
      {
        title: 'Error Prevention and Detection',
        description:
          'Aduvanta validates data against SAAI error codes, Anexo 22 catalogs, and your own custom rules. Errors are caught at the point of entry, not after submission. Dashboards highlight operations with warnings so your team can resolve issues proactively.',
      },
      {
        title: 'Regulatory Reporting',
        description:
          'Generate compliance reports for internal audits, client reporting, and regulatory authorities. Track compliance metrics over time, identify recurring issues, and demonstrate due diligence to authorities when required.',
      },
    ],
    cta: {
      heading: 'Take control of your compliance',
      description:
        'Create your free account and see how Aduvanta makes compliance manageable.',
      button: 'Get Started',
    },
  },
  'es-MX': {
    title: 'Cumplimiento Aduanero y Auditoria — Control de Operaciones',
    description:
      'Asegure el cumplimiento regulatorio y mantenga pistas de auditoria completas con Aduvanta. Validacion automatica, prevencion de errores, reglas de cumplimiento y registros de auditoria inmutables para cada operacion aduanal.',
    hero: {
      heading: 'Cumplimiento Aduanero en el que Puede Confiar',
      subheading:
        'Los incumplimientos en operaciones aduanales generan multas, retrasos y dano reputacional. Aduvanta integra el cumplimiento en cada flujo de trabajo — reglas de validacion automaticas, deteccion de errores en tiempo real y registros de auditoria inmutables que le dan control total sobre sus operaciones.',
    },
    features: [
      {
        title: 'Reglas de Cumplimiento Automaticas',
        description:
          'Defina y aplique reglas de cumplimiento que se ejecutan automaticamente en cada pedimento y operacion aduanal. Las reglas cubren precision en clasificacion arancelaria, documentacion requerida, umbrales de valor, restricciones por pais y requisitos regulatorios. Cuando una regla se viola, el sistema la senala antes de la presentacion.',
      },
      {
        title: 'Pista de Auditoria Inmutable',
        description:
          'Cada accion en Aduvanta queda registrada: quien hizo que, cuando y en que contexto. Los registros de auditoria son de solo escritura y no pueden modificarse ni eliminarse. Esto proporciona un registro defendible para auditorias regulatorias, revisiones internas y resolucion de controversias.',
      },
      {
        title: 'Prevencion y Deteccion de Errores',
        description:
          'Aduvanta valida datos contra codigos de error del SAAI, catalogos del Anexo 22 y sus propias reglas personalizadas. Los errores se detectan en el punto de captura, no despues de la presentacion. Los tableros resaltan operaciones con advertencias para que su equipo resuelva problemas proactivamente.',
      },
      {
        title: 'Reportes Regulatorios',
        description:
          'Genere reportes de cumplimiento para auditorias internas, reportes a clientes y autoridades regulatorias. Rastree metricas de cumplimiento a lo largo del tiempo, identifique problemas recurrentes y demuestre la debida diligencia ante las autoridades cuando sea requerido.',
      },
    ],
    cta: {
      heading: 'Tome el control de su cumplimiento',
      description:
        'Cree su cuenta gratuita y descubra como Aduvanta hace manejable el cumplimiento.',
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
      ? 'Cumplimiento Aduanero y Auditoria — Control de Operaciones'
      : 'Customs Compliance & Audit — Operations Control',
    description: isEs
      ? 'Cumplimiento aduanero con validacion automatica, pistas de auditoria inmutables, prevencion de errores y reportes regulatorios. Controle sus operaciones con Aduvanta.'
      : 'Customs compliance with automated validation, immutable audit trails, error prevention, and regulatory reporting. Control your operations with Aduvanta.',
    path: '/cumplimiento-aduanero',
    keywords: isEs
      ? 'cumplimiento aduanero, auditoria aduanal, control de operaciones aduanales, reglas de cumplimiento, pista de auditoria'
      : 'customs compliance, customs audit, operations control, compliance rules, audit trail, regulatory compliance Mexico',
  })
}

export default async function CumplimientoAduaneroPage({ params }: Props) {
  const { locale } = await params
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t.title, url: `${BASE_URL}/${locale}/cumplimiento-aduanero` },
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
