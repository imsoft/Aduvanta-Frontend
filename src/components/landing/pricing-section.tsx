'use client'

import { useState } from 'react'
import { Check, ArrowRight } from '@phosphor-icons/react'
import { Link } from '@/i18n/navigation'

type Tier = {
  name: string
  monthlyPrice: string
  annualPrice: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

const content = {
  'en-US': {
    badge: 'Pricing',
    title: 'Invest in your operation, not your tools',
    description: 'All plans include a 14-day free trial. No credit card required.',
    monthly: 'Monthly',
    annual: 'Annual',
    annualSave: 'Save 20%',
    popular: 'Most popular',
    guarantee: '14-day free trial on all plans. Cancel anytime.',
    contact: 'Need something custom?',
    contactCta: 'Talk to us',
    tiers: [
      {
        name: 'Starter',
        monthlyPrice: '$2,500',
        annualPrice: '$2,000',
        period: 'MXN/mo',
        description: 'For independent brokers managing their own operations.',
        features: [
          '1 organization',
          '3 users included',
          'Pedimentos & entries',
          'Tariff classification (TIGIE)',
          'Anexo 22 & SAAI reference',
          'Unit converter',
          'Email support',
        ],
        cta: 'Start free trial',
        highlighted: false,
      },
      {
        name: 'Professional',
        monthlyPrice: '$12,000',
        annualPrice: '$9,600',
        period: 'MXN/mo',
        description: 'For agencies that need full operational control and client management.',
        features: [
          '1 organization',
          '15 users included',
          'Everything in Starter',
          'Full operations & traffic',
          'Warehouse control',
          'Billing & treasury',
          'Document management',
          'Client portal',
          'Priority support',
        ],
        cta: 'Start free trial',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        monthlyPrice: '$35,000',
        annualPrice: '$28,000',
        period: 'MXN/mo',
        description: 'For customs groups and IMMEX companies at scale.',
        features: [
          'Unlimited organizations',
          'Unlimited users',
          'Everything in Professional',
          'Analytics & BI dashboards',
          'AI Assistant',
          'Full API access',
          'Custom integrations',
          'SSO / SAML',
          'Dedicated account manager',
        ],
        cta: 'Talk to sales',
        highlighted: false,
      },
    ] satisfies Tier[],
  },
  'es-MX': {
    badge: 'Precios',
    title: 'Invierte en tu operacion, no en tus herramientas',
    description: 'Todos los planes incluyen 14 dias gratis. Sin tarjeta de credito.',
    monthly: 'Mensual',
    annual: 'Anual',
    annualSave: 'Ahorra 20%',
    popular: 'Mas popular',
    guarantee: '14 dias gratis en todos los planes. Cancela cuando quieras.',
    contact: 'Necesitas algo a la medida?',
    contactCta: 'Platicamos',
    tiers: [
      {
        name: 'Starter',
        monthlyPrice: '$2,500',
        annualPrice: '$2,000',
        period: 'MXN/mes',
        description: 'Para agentes independientes que manejan sus propias operaciones.',
        features: [
          '1 organizacion',
          '3 usuarios incluidos',
          'Pedimentos y entradas',
          'Clasificacion arancelaria (TIGIE)',
          'Referencia Anexo 22 y SAAI',
          'Conversor de unidades',
          'Soporte por email',
        ],
        cta: 'Empezar gratis',
        highlighted: false,
      },
      {
        name: 'Professional',
        monthlyPrice: '$12,000',
        annualPrice: '$9,600',
        period: 'MXN/mes',
        description: 'Para agencias que necesitan control operacional completo y gestion de clientes.',
        features: [
          '1 organizacion',
          '15 usuarios incluidos',
          'Todo lo de Starter',
          'Operaciones y trafico completo',
          'Control de almacenes',
          'Facturacion y tesoreria',
          'Gestion documental',
          'Portal de clientes',
          'Soporte prioritario',
        ],
        cta: 'Empezar gratis',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        monthlyPrice: '$35,000',
        annualPrice: '$28,000',
        period: 'MXN/mes',
        description: 'Para grupos aduanales y empresas IMMEX a escala.',
        features: [
          'Organizaciones ilimitadas',
          'Usuarios ilimitados',
          'Todo lo de Professional',
          'Dashboards de analitica y BI',
          'Asistente IA',
          'Acceso completo a API',
          'Integraciones a la medida',
          'SSO / SAML',
          'Account manager dedicado',
        ],
        cta: 'Hablar con ventas',
        highlighted: false,
      },
    ] satisfies Tier[],
  },
} as const

type Props = {
  locale: string
}

export function PricingSection({ locale }: Props) {
  const [annual, setAnnual] = useState(true)
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section id="pricing" className="border-y border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.badge}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{t.description}</p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
            <button
              type="button"
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                !annual
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setAnnual(false)}
            >
              {t.monthly}
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                annual
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setAnnual(true)}
            >
              {t.annual}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                annual
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-primary/10 text-primary'
              }`}>
                {t.annualSave}
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-3">
          {t.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all ${
                tier.highlighted
                  ? 'border-primary bg-card shadow-xl shadow-primary/5'
                  : 'border-border/50 bg-card hover:border-border'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 right-6">
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {t.popular}
                  </span>
                </div>
              )}

              <h3 className="text-base font-semibold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {annual ? tier.annualPrice : tier.monthlyPrice}
                </span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`mt-7 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                {tier.cta}
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t.guarantee}
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
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
