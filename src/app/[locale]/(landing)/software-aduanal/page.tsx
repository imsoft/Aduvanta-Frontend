import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Check } from '@phosphor-icons/react/dist/ssr'
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import { FileText } from '@phosphor-icons/react/dist/ssr'
import { Users } from '@phosphor-icons/react/dist/ssr'
import { Sparkle } from '@phosphor-icons/react/dist/ssr'

const modules = {
  'en-US': [
    { name: 'Tariff Classification (TIGIE)', description: 'AI-powered tariff lookup with Anexo 22 cross-reference. Classify goods in seconds, not hours.' },
    { name: 'Customs Entries (Pedimentos)', description: 'Full lifecycle management from draft to release. Built-in SAAI error validation and prevalidation.' },
    { name: 'Customs Operations / Traffic', description: 'Real-time tracking of every operation across ports, warehouses, and transport legs.' },
    { name: 'Customs Valuation', description: 'Automated valuation calculations with method selection and adjustment tracking.' },
    { name: 'COVE / E-Documents', description: 'Digital document submission to VUCEM with validation before upload.' },
    { name: 'Billing', description: 'Invoice generation tied to operations. CFDI-compliant with automatic tax calculation.' },
    { name: 'Treasury', description: 'Payment tracking, bank reconciliation, and cash flow visibility across operations.' },
    { name: 'Document Management', description: 'Centralized document storage with versioning, tagging, and permission-controlled access.' },
    { name: 'Warehouse Control', description: 'Inventory tracking for bonded and fiscal warehouses with movement history.' },
    { name: 'CUPO Letters', description: 'Quota management and tracking for preferential tariff programs.' },
    { name: 'Notifications', description: 'Real-time alerts for operation status changes, deadlines, and compliance events.' },
    { name: 'Client Portal', description: 'Self-service portal for your clients to track operations and download documents.' },
    { name: 'Analytics & BI', description: 'Dashboards and reports for operational performance, revenue, and compliance metrics.' },
    { name: 'AI Assistant', description: 'Intelligent assistant for tariff classification, regulation lookup, and operational guidance.' },
  ],
  'es-MX': [
    { name: 'Clasificacion Arancelaria (TIGIE)', description: 'Busqueda arancelaria con IA y referencia cruzada al Anexo 22. Clasifica mercancias en segundos.' },
    { name: 'Pedimentos Aduanales', description: 'Gestion completa del ciclo de vida desde borrador hasta desaduanamiento. Validacion integrada de errores SAAI.' },
    { name: 'Operaciones / Trafico', description: 'Seguimiento en tiempo real de cada operacion en puertos, almacenes y tramos de transporte.' },
    { name: 'Valoracion Aduanera', description: 'Calculos de valoracion automatizados con seleccion de metodo y seguimiento de ajustes.' },
    { name: 'COVE / E-Documents', description: 'Envio de documentos digitales a VUCEM con validacion previa a la carga.' },
    { name: 'Facturacion', description: 'Generacion de facturas vinculadas a operaciones. Cumplimiento CFDI con calculo automatico de impuestos.' },
    { name: 'Tesoreria', description: 'Seguimiento de pagos, conciliacion bancaria y visibilidad de flujo de efectivo.' },
    { name: 'Gestion Documental', description: 'Almacenamiento centralizado con versionamiento, etiquetado y acceso controlado por permisos.' },
    { name: 'Control de Almacenes', description: 'Rastreo de inventario para almacenes fiscalizados con historial de movimientos.' },
    { name: 'Cartas CUPO', description: 'Gestion y seguimiento de cupos para programas de preferencias arancelarias.' },
    { name: 'Notificaciones', description: 'Alertas en tiempo real para cambios de estatus, vencimientos y eventos de cumplimiento.' },
    { name: 'Portal de Clientes', description: 'Portal de autoservicio para que tus clientes rastreen operaciones y descarguen documentos.' },
    { name: 'Analitica e Inteligencia', description: 'Dashboards y reportes de desempeno operativo, ingresos y metricas de cumplimiento.' },
    { name: 'Asistente IA', description: 'Asistente inteligente para clasificacion arancelaria, consulta de regulaciones y guia operativa.' },
  ],
} as const

const content = {
  'en-US': {
    title: 'Cloud Customs Software for Customs Agencies',
    heroSubtitle: 'One platform to run your entire customs agency. Pedimentos, tariff classification, client portal, billing, compliance — all in the cloud.',
    heroCta: 'Start your free trial',
    heroSecondaryCta: 'See pricing',
    painTitle: 'Why Customs Agencies Need Modern Software',
    painSubtitle: 'The tools that built the customs industry are holding it back.',
    pains: [
      { title: 'Disconnected desktop apps', description: 'Running 5-10 separate Windows programs that do not talk to each other wastes hours every day. Data gets re-entered, errors multiply, and nothing is in sync.' },
      { title: 'No remote access', description: 'Desktop-only software ties your team to the office. When a client calls at 8 PM, you cannot check the status of their pedimento from your phone.' },
      { title: 'Zero visibility for clients', description: 'Clients call and email to ask "where is my shipment?" because they have no way to check themselves. Your team spends hours fielding status requests.' },
      { title: 'Compliance risk without audit trails', description: 'When SAT audits your agency, can you show exactly who modified a pedimento, when, and why? Most legacy systems cannot.' },
      { title: 'Scaling means more chaos', description: 'Adding staff, clients, or a second office with legacy tools means more licenses, more data silos, and more things that can break.' },
    ],
    modulesTitle: '14 Integrated Modules. One Platform.',
    modulesSubtitle: 'Every function your customs agency needs, built to work together from day one.',
    diffTitle: 'What Makes Aduvanta Different',
    diffs: [
      { icon: 'cloud', title: '100% Cloud-Based', description: 'Access from any browser, any device, anywhere. No installations, no VPNs, no Windows dependency.' },
      { icon: 'shield', title: 'Enterprise Security', description: 'Role-based access control, multi-tenant data isolation, encrypted storage, and complete audit trails for every action.' },
      { icon: 'users', title: 'Multi-Organization', description: 'Manage multiple customs agencies or client organizations from a single account. Each with isolated data and independent permissions.' },
      { icon: 'sparkle', title: 'AI-Powered', description: 'Tariff classification suggestions, automated validation, and intelligent error detection that gets smarter with every operation.' },
    ],
    socialTitle: 'Trusted by Growing Customs Agencies',
    socialDescription: 'Agencies across Mexico are switching from legacy desktop software to Aduvanta to modernize their operations, reduce errors, and give their clients a better experience.',
    ctaTitle: 'Ready to modernize your customs agency?',
    ctaDescription: '14-day free trial. No credit card required. No installation. Up and running in 15 minutes.',
    ctaButton: 'Start your free trial',
  },
  'es-MX': {
    title: 'Software Aduanal en la Nube para Agencias Aduanales',
    heroSubtitle: 'Una plataforma para operar toda tu agencia aduanal. Pedimentos, clasificacion arancelaria, portal de clientes, facturacion, cumplimiento — todo en la nube.',
    heroCta: 'Empieza tu prueba gratis',
    heroSecondaryCta: 'Ver precios',
    painTitle: 'Por Que las Agencias Aduanales Necesitan Software Moderno',
    painSubtitle: 'Las herramientas que construyeron la industria aduanera ahora la estan frenando.',
    pains: [
      { title: 'Aplicaciones de escritorio desconectadas', description: 'Usar 5-10 programas de Windows separados que no se comunican entre si desperdicia horas cada dia. Los datos se capturan multiples veces, los errores se multiplican y nada esta sincronizado.' },
      { title: 'Sin acceso remoto', description: 'El software de escritorio ata a tu equipo a la oficina. Cuando un cliente llama a las 8 PM, no puedes revisar el estatus de su pedimento desde tu celular.' },
      { title: 'Cero visibilidad para clientes', description: 'Los clientes llaman y envian correos preguntando "donde esta mi embarque?" porque no tienen forma de verificar por si mismos. Tu equipo pierde horas respondiendo consultas de estatus.' },
      { title: 'Riesgo de cumplimiento sin pistas de auditoria', description: 'Cuando el SAT audita tu agencia, puedes demostrar exactamente quien modifico un pedimento, cuando y por que? La mayoria de los sistemas legados no pueden.' },
      { title: 'Crecer significa mas caos', description: 'Agregar personal, clientes o una segunda oficina con herramientas legadas significa mas licencias, mas silos de datos y mas cosas que pueden fallar.' },
    ],
    modulesTitle: '14 Modulos Integrados. Una Plataforma.',
    modulesSubtitle: 'Cada funcion que tu agencia aduanal necesita, disenada para trabajar en conjunto desde el dia uno.',
    diffTitle: 'Que Hace Diferente a Aduvanta',
    diffs: [
      { icon: 'cloud', title: '100% en la Nube', description: 'Accede desde cualquier navegador, cualquier dispositivo, donde sea. Sin instalaciones, sin VPNs, sin dependencia de Windows.' },
      { icon: 'shield', title: 'Seguridad Empresarial', description: 'Control de acceso basado en roles, aislamiento de datos multi-inquilino, almacenamiento cifrado y pistas de auditoria completas para cada accion.' },
      { icon: 'users', title: 'Multi-Organizacion', description: 'Administra multiples agencias aduanales u organizaciones de clientes desde una sola cuenta. Cada una con datos aislados y permisos independientes.' },
      { icon: 'sparkle', title: 'Potenciado por IA', description: 'Sugerencias de clasificacion arancelaria, validacion automatizada y deteccion inteligente de errores que mejora con cada operacion.' },
    ],
    socialTitle: 'Agencias Aduanales en Crecimiento Confian en Nosotros',
    socialDescription: 'Agencias en todo Mexico estan migrando de software de escritorio legado a Aduvanta para modernizar sus operaciones, reducir errores y darle a sus clientes una mejor experiencia.',
    ctaTitle: 'Listo para modernizar tu agencia aduanal?',
    ctaDescription: '14 dias de prueba gratis. Sin tarjeta de credito. Sin instalacion. Operando en 15 minutos.',
    ctaButton: 'Empieza tu prueba gratis',
  },
} as const

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  return buildPageMetadata({
    locale,
    title: isEs
      ? 'Software Aduanal en la Nube para Agencias Aduanales'
      : 'Cloud Customs Software for Customs Agencies',
    description: isEs
      ? 'Software aduanal 100% en la nube. Pedimentos, clasificacion arancelaria TIGIE, Anexo 22, portal de clientes, facturacion y auditoria en una sola plataforma para agencias aduanales en Mexico.'
      : 'Cloud-based customs software. Pedimentos, TIGIE tariff classification, Anexo 22, client portal, billing, and audit in one platform for customs agencies in Mexico.',
    path: '/software-aduanal',
    keywords: 'software aduanal, software aduanal Mexico, sistema aduanero, agencia aduanal software',
  })
}

export default async function SoftwareAduanalPage({ params }: Props) {
  const { locale } = await params
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const mods = locale === 'es-MX' ? modules['es-MX'] : modules['en-US']
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t.title, url: `${BASE_URL}/${locale}/software-aduanal` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted/30 px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {t.heroCta}
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link
              href="/precios"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted"
            >
              {t.heroSecondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            {t.painTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            {t.painSubtitle}
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.pains.map((pain) => (
              <div key={pain.title} className="rounded-lg border p-6">
                <h3 className="font-semibold">{pain.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pain.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14 Modules */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            {t.modulesTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            {t.modulesSubtitle}
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mods.map((mod) => (
              <div
                key={mod.name}
                className="flex gap-3 rounded-lg border bg-background p-5"
              >
                <div className="mt-0.5 shrink-0">
                  <Check size={20} weight="bold" className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{mod.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mod.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            {t.diffTitle}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {t.diffs.map((diff) => (
              <div key={diff.title} className="flex gap-4 rounded-lg border p-6">
                <div className="shrink-0">
                  {diff.icon === 'shield' && (
                    <ShieldCheck size={28} className="text-primary" />
                  )}
                  {diff.icon === 'users' && (
                    <Users size={28} className="text-primary" />
                  )}
                  {diff.icon === 'sparkle' && (
                    <Sparkle size={28} className="text-primary" />
                  )}
                  {diff.icon === 'cloud' && (
                    <FileText size={28} className="text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{diff.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {diff.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {t.socialTitle}
          </h2>
          <p className="mt-4 text-muted-foreground">{t.socialDescription}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">{t.ctaTitle}</h2>
          <p className="mt-4 text-muted-foreground">{t.ctaDescription}</p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {t.ctaButton}
            <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </>
  )
}
