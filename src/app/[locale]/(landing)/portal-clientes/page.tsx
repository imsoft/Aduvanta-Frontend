import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    title: 'Client Portal for Customs Agencies',
    description:
      'Give your clients visibility into their customs operations. Aduvanta\'s client portal provides self-service access to operation status, documents, and reports — with role-based permissions.',
    hero: {
      heading: 'A Client Portal Built for Customs Agencies',
      subheading:
        'Your clients expect transparency. Aduvanta\'s client portal lets importers and exporters track their operations, download documents, and review status updates in real time — without calling your office.',
    },
    features: [
      {
        title: 'Self-Service Operation Tracking',
        description:
          'Clients can log in and see the current status of every pedimento, shipment, and customs operation associated with their account. No more phone calls or email chains asking for updates.',
      },
      {
        title: 'Document Access',
        description:
          'Share pedimentos, invoices, packing lists, certificates, and compliance documents directly through the portal. Clients download what they need, when they need it, from a secure and organized repository.',
      },
      {
        title: 'Role-Based Permissions',
        description:
          'Control exactly what each client user can see and do. Assign read-only access for operation viewing, document download permissions, or restricted access to specific operations. Every permission is enforced by the backend.',
      },
      {
        title: 'Branded and Professional',
        description:
          'The client portal reflects your agency\'s professionalism. Clients interact with a modern, responsive interface that works on any device — a significant upgrade from email-based workflows and legacy systems.',
      },
    ],
    cta: {
      heading: 'Deliver a better client experience',
      description:
        'Create your free account and set up your client portal in minutes.',
      button: 'Get Started',
    },
  },
  'es-MX': {
    title: 'Portal de Clientes para Agencias Aduanales',
    description:
      'Brinde a sus clientes visibilidad sobre sus operaciones aduanales. El portal de clientes de Aduvanta ofrece acceso de autoservicio a estatus de operaciones, documentos y reportes — con permisos basados en roles.',
    hero: {
      heading: 'Un Portal de Clientes Disenado para Agencias Aduanales',
      subheading:
        'Sus clientes esperan transparencia. El portal de clientes de Aduvanta permite a importadores y exportadores rastrear sus operaciones, descargar documentos y revisar actualizaciones de estatus en tiempo real — sin necesidad de llamar a su oficina.',
    },
    features: [
      {
        title: 'Seguimiento de Operaciones en Autoservicio',
        description:
          'Los clientes pueden iniciar sesion y ver el estatus actual de cada pedimento, embarque y operacion aduanal asociada a su cuenta. Sin mas llamadas telefonicas o cadenas de correos preguntando por actualizaciones.',
      },
      {
        title: 'Acceso a Documentos',
        description:
          'Comparta pedimentos, facturas, listas de empaque, certificados y documentos de cumplimiento directamente a traves del portal. Los clientes descargan lo que necesitan, cuando lo necesitan, desde un repositorio seguro y organizado.',
      },
      {
        title: 'Permisos Basados en Roles',
        description:
          'Controle exactamente lo que cada usuario cliente puede ver y hacer. Asigne acceso de solo lectura para visualizacion de operaciones, permisos de descarga de documentos o acceso restringido a operaciones especificas. Cada permiso es validado por el backend.',
      },
      {
        title: 'Profesional y de Marca',
        description:
          'El portal de clientes refleja el profesionalismo de su agencia. Los clientes interactuan con una interfaz moderna y responsiva que funciona en cualquier dispositivo — una mejora significativa respecto a flujos basados en correo electronico y sistemas obsoletos.',
      },
    ],
    cta: {
      heading: 'Ofrezca una mejor experiencia a sus clientes',
      description:
        'Cree su cuenta gratuita y configure su portal de clientes en minutos.',
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
      ? 'Portal de Clientes para Agencias Aduanales'
      : 'Client Portal for Customs Agencies',
    description: isEs
      ? 'Portal de clientes para agencias aduanales con seguimiento de operaciones, acceso a documentos y permisos basados en roles. Brinde transparencia a sus clientes con Aduvanta.'
      : 'Client portal for customs agencies with operation tracking, document access, and role-based permissions. Give your clients transparency with Aduvanta.',
    path: '/portal-clientes',
    keywords: isEs
      ? 'portal de clientes, portal para agencias aduanales, portal de clientes aduanales, acceso de clientes, seguimiento de operaciones'
      : 'client portal, customs agency client portal, customs client access, operation tracking portal, customs document portal',
  })
}

export default async function PortalClientesPage({ params }: Props) {
  const { locale } = await params
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t.title, url: `${BASE_URL}/${locale}/portal-clientes` },
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
