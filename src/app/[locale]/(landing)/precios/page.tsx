import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

const tiers = {
  'en-US': [
    {
      name: 'Starter',
      price: '$2,000',
      period: '/mo',
      description: 'For small agencies getting started with modern customs software.',
      features: [
        'Up to 5 users',
        '100 pedimentos/month',
        'Tariff classification (TIGIE)',
        'Anexo 22 catalogs',
        'Basic audit logging',
        'Email support',
      ],
      cta: 'Start free trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$8,000',
      period: '/mo',
      description: 'For growing agencies that need the full platform.',
      features: [
        'Up to 20 users',
        'Unlimited pedimentos',
        'All operational modules',
        'Client portal',
        'Advanced analytics',
        'Priority support',
        'Data migration assistance',
        'Custom reports',
      ],
      cta: 'Start free trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$35,000',
      period: '/mo',
      description: 'For large operations with custom requirements.',
      features: [
        'Unlimited users',
        'Unlimited pedimentos',
        'All Professional features',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Full data migration',
        'On-boarding training',
        'API access',
      ],
      cta: 'Contact sales',
      highlighted: false,
    },
  ],
  'es-MX': [
    {
      name: 'Starter',
      price: '$2,000',
      period: '/mes',
      description: 'Para agencias pequenas que inician con software aduanal moderno.',
      features: [
        'Hasta 5 usuarios',
        '100 pedimentos/mes',
        'Clasificacion arancelaria (TIGIE)',
        'Catalogos Anexo 22',
        'Registro de auditoria basico',
        'Soporte por correo',
      ],
      cta: 'Iniciar prueba gratis',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$8,000',
      period: '/mes',
      description: 'Para agencias en crecimiento que necesitan la plataforma completa.',
      features: [
        'Hasta 20 usuarios',
        'Pedimentos ilimitados',
        'Todos los modulos operativos',
        'Portal de clientes',
        'Analiticas avanzadas',
        'Soporte prioritario',
        'Asistencia en migracion de datos',
        'Reportes personalizados',
      ],
      cta: 'Iniciar prueba gratis',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$35,000',
      period: '/mes',
      description: 'Para operaciones grandes con requerimientos especificos.',
      features: [
        'Usuarios ilimitados',
        'Pedimentos ilimitados',
        'Todo lo de Professional',
        'Integraciones personalizadas',
        'Gerente de cuenta dedicado',
        'Garantia de SLA',
        'Migracion completa de datos',
        'Capacitacion de onboarding',
        'Acceso a API',
      ],
      cta: 'Contactar ventas',
      highlighted: false,
    },
  ],
} as const

const faq = {
  'en-US': [
    {
      question: 'Is there a free trial?',
      answer:
        'Yes. All plans include a 14-day free trial with full access. No credit card required.',
    },
    {
      question: 'Can I change plans later?',
      answer:
        'Absolutely. You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept bank transfers, credit/debit cards, and SPEI. All prices are in Mexican pesos (MXN) plus applicable taxes.',
    },
    {
      question: 'Do you offer annual billing?',
      answer:
        'Yes. Annual plans receive a 15% discount compared to monthly billing.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer:
        'Your data remains available for 30 days after cancellation. You can export everything at any time.',
    },
    {
      question: 'Do you issue CFDI invoices?',
      answer:
        'Yes. We issue CFDI-compliant invoices for all payments automatically.',
    },
  ],
  'es-MX': [
    {
      question: 'Hay prueba gratis?',
      answer:
        'Si. Todos los planes incluyen una prueba gratis de 14 dias con acceso completo. No se requiere tarjeta de credito.',
    },
    {
      question: 'Puedo cambiar de plan despues?',
      answer:
        'Por supuesto. Puedes subir o bajar de plan en cualquier momento. Los cambios se aplican en tu proximo ciclo de facturacion.',
    },
    {
      question: 'Que metodos de pago aceptan?',
      answer:
        'Aceptamos transferencias bancarias, tarjetas de credito/debito y SPEI. Todos los precios son en pesos mexicanos (MXN) mas impuestos aplicables.',
    },
    {
      question: 'Ofrecen facturacion anual?',
      answer:
        'Si. Los planes anuales tienen un 15% de descuento comparado con la facturacion mensual.',
    },
    {
      question: 'Que pasa con mis datos si cancelo?',
      answer:
        'Tus datos permanecen disponibles por 30 dias despues de la cancelacion. Puedes exportar todo en cualquier momento.',
    },
    {
      question: 'Emiten facturas CFDI?',
      answer:
        'Si. Emitimos facturas CFDI automaticamente para todos los pagos.',
    },
  ],
} as const

const labels = {
  'en-US': {
    title: 'Pricing — Aduvanta Customs Software',
    heading: 'Simple, transparent pricing',
    subheading:
      'Choose the plan that fits your agency. All plans include a 14-day free trial — no credit card required.',
    currency: 'MXN',
    faqHeading: 'Frequently asked questions',
    ctaHeading: 'Ready to modernize your customs operations?',
    ctaBody:
      'Start your 14-day free trial today. No credit card required, no commitments.',
    ctaButton: 'Start free trial',
    popular: 'Most popular',
  },
  'es-MX': {
    title: 'Precios — Software Aduanal Aduvanta',
    heading: 'Precios simples y transparentes',
    subheading:
      'Elige el plan ideal para tu agencia. Todos los planes incluyen prueba gratis de 14 dias — sin tarjeta de credito.',
    currency: 'MXN',
    faqHeading: 'Preguntas frecuentes',
    ctaHeading: 'Listo para modernizar tus operaciones aduanales?',
    ctaBody:
      'Inicia tu prueba gratis de 14 dias hoy. Sin tarjeta de credito, sin compromisos.',
    ctaButton: 'Iniciar prueba gratis',
    popular: 'Mas popular',
  },
} as const

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  return buildPageMetadata({
    locale,
    title: isEs
      ? 'Precios — Software Aduanal Aduvanta'
      : 'Pricing — Aduvanta Customs Software',
    description: isEs
      ? 'Conoce los precios de Aduvanta. Planes desde $2,000 MXN/mes. Prueba gratis 14 dias, sin tarjeta de credito. Software aduanal en la nube.'
      : 'Aduvanta pricing plans starting at $2,000 MXN/month. 14-day free trial, no credit card required. Cloud customs software for Mexican agencies.',
    path: '/precios',
    keywords:
      'precios software aduanal, pricing customs software, costo sistema aduanero',
  })
}

export default async function PreciosPage({ params }: Props) {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  const t = isEs ? labels['es-MX'] : labels['en-US']
  const plans = isEs ? tiers['es-MX'] : tiers['en-US']
  const faqs = isEs ? faq['es-MX'] : faq['en-US']

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t.title, url: `${BASE_URL}/${locale}/precios` },
  ])

  const pricingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Aduvanta',
    description: isEs
      ? 'Software aduanal en la nube para agencias aduanales en Mexico'
      : 'Cloud customs software for Mexican customs agencies',
    url: `${BASE_URL}/${locale}/precios`,
    brand: {
      '@type': 'Brand',
      name: 'Aduvanta',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '2000',
        priceCurrency: 'MXN',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '2000',
          priceCurrency: 'MXN',
          billingDuration: 'P1M',
        },
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Professional',
        price: '8000',
        priceCurrency: 'MXN',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '8000',
          priceCurrency: 'MXN',
          billingDuration: 'P1M',
        },
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise',
        price: '35000',
        priceCurrency: 'MXN',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '35000',
          priceCurrency: 'MXN',
          billingDuration: 'P1M',
        },
        availability: 'https://schema.org/InStock',
      },
    ],
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Pricing hero */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {t.subheading}
        </p>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.highlighted
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border bg-background'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  {t.popular}
                </span>
              )}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-6">
                <span className="text-sm text-muted-foreground">
                  {t.currency}{' '}
                </span>
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
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
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/sign-up"
                  className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.faqHeading}
        </h2>
        <dl className="mt-8 space-y-6">
          {faqs.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-2 text-muted-foreground">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50 px-6 py-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.ctaHeading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {t.ctaBody}
        </p>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className="inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  )
}
