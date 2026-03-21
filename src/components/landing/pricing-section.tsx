import { Check, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Link } from '@/i18n/navigation'

type PricingTier = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

const content = {
  'en-US': {
    badge: 'Pricing',
    title: 'Simple, transparent pricing',
    description: 'Choose the plan that fits your operation. All plans include core platform access.',
    contact: 'Need a custom plan?',
    contactCta: 'Contact Sales',
    tiers: [
      {
        name: 'Starter',
        price: '$2,500',
        period: 'MXN / month',
        description: 'For independent customs brokers starting their digital transformation.',
        features: [
          '1 organization',
          'Up to 3 users',
          'Pedimentos & customs entries',
          'TIGIE & tariff classification',
          'Anexo 22 & SAAI reference',
          'Unit converter',
          'Email support',
        ],
        cta: 'Start Free Trial',
        highlighted: false,
      },
      {
        name: 'Professional',
        price: '$12,000',
        period: 'MXN / month',
        description: 'For mid-size agencies that need full operational control.',
        features: [
          '1 organization',
          'Up to 15 users',
          'Everything in Starter',
          'Full operations & traffic',
          'Warehouse control',
          'Billing & treasury',
          'Document management',
          'Client portal',
          'Notifications',
          'Priority support',
        ],
        cta: 'Start Free Trial',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: '$35,000',
        period: 'MXN / month',
        description: 'For large customs groups and IMMEX companies.',
        features: [
          'Multi-organization',
          'Unlimited users',
          'Everything in Professional',
          'Analytics & BI',
          'AI Assistant',
          'API access',
          'Custom integrations',
          'SSO / SAML',
          'Dedicated SLA',
          'Onboarding included',
        ],
        cta: 'Contact Sales',
        highlighted: false,
      },
    ] satisfies PricingTier[],
  },
  'es-MX': {
    badge: 'Precios',
    title: 'Precios simples y transparentes',
    description: 'Elige el plan que se adapte a tu operacion. Todos los planes incluyen acceso a la plataforma base.',
    contact: 'Necesitas un plan personalizado?',
    contactCta: 'Contactar Ventas',
    tiers: [
      {
        name: 'Starter',
        price: '$2,500',
        period: 'MXN / mes',
        description: 'Para agentes aduanales independientes iniciando su transformacion digital.',
        features: [
          '1 organizacion',
          'Hasta 3 usuarios',
          'Pedimentos y entradas aduaneras',
          'TIGIE y clasificacion arancelaria',
          'Anexo 22 y referencia SAAI',
          'Conversor de unidades',
          'Soporte por email',
        ],
        cta: 'Prueba Gratuita',
        highlighted: false,
      },
      {
        name: 'Professional',
        price: '$12,000',
        period: 'MXN / mes',
        description: 'Para agencias medianas que necesitan control operacional completo.',
        features: [
          '1 organizacion',
          'Hasta 15 usuarios',
          'Todo lo de Starter',
          'Operaciones y trafico completo',
          'Control de almacenes',
          'Facturacion y tesoreria',
          'Gestion documental',
          'Portal de clientes',
          'Notificaciones',
          'Soporte prioritario',
        ],
        cta: 'Prueba Gratuita',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: '$35,000',
        period: 'MXN / mes',
        description: 'Para grupos aduanales grandes y empresas IMMEX.',
        features: [
          'Multi-organizacion',
          'Usuarios ilimitados',
          'Todo lo de Professional',
          'Analitica y BI',
          'Asistente IA',
          'Acceso a API',
          'Integraciones personalizadas',
          'SSO / SAML',
          'SLA dedicado',
          'Onboarding incluido',
        ],
        cta: 'Contactar Ventas',
        highlighted: false,
      },
    ] satisfies PricingTier[],
  },
} as const

type Props = {
  locale: string
}

export function PricingSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section id="pricing" className="border-t border-border/50 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-background px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          {t.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all ${
                tier.highlighted
                  ? 'border-primary bg-card shadow-lg shadow-primary/10'
                  : 'border-border/50 bg-card hover:border-border'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    {locale === 'es-MX' ? 'Mas popular' : 'Most Popular'}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={18}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`mt-8 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-primary text-primary-foreground shadow-sm hover:opacity-90'
                    : 'border border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                {tier.cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          {t.contact}{' '}
          <a
            href="mailto:ventas@aduvanta.com"
            className="font-medium text-primary hover:underline"
          >
            {t.contactCta}
          </a>
        </p>
      </div>
    </section>
  )
}
