import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'
import { StaticPageHero } from '@/components/landing/static-page-hero'
import { StaticCtaCard } from '@/components/landing/static-cta-card'

type Tier = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

type FaqItem = { question: string; answer: string }

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.precios.meta' })
  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    path: '/precios',
    keywords: t('keywords'),
  })
}

export default async function PreciosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing.precios' })
  const plans = t.raw('tiers') as Tier[]
  const faqs = t.raw('faq') as FaqItem[]

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t('title'), url: `${BASE_URL}/${locale}/precios` },
  ])

  const pricingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Aduvanta',
    description: t('subheading'),
    url: `${BASE_URL}/${locale}/precios`,
    brand: { '@type': 'Brand', name: 'Aduvanta' },
    offers: plans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.price.replace(/[$,]/g, ''),
      priceCurrency: 'MXN',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.price.replace(/[$,]/g, ''),
        priceCurrency: 'MXN',
        billingDuration: 'P1M',
      },
      availability: 'https://schema.org/InStock',
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'es-MX' ? 'es-MX' : 'en-US',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
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

      <StaticPageHero title={t('heading')} subtitle={t('subheading')} width="md" />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal
              key={plan.name}
              variant="scale"
              delay={120 * i}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.highlighted
                  ? 'border-primary bg-primary/5 shadow-lg hover:shadow-primary/20'
                  : 'border-border bg-background'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                  {t('popular')}
                </span>
              )}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-6">
                <span className="text-sm text-muted-foreground">
                  {t('currency')}{' '}
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
                  className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20'
                      : 'border border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('faqHeading')}
          </h2>
        </Reveal>
        <dl className="mt-8 space-y-6">
          {faqs.map((item, i) => (
            <Reveal key={item.question} delay={60 * i}>
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-2 text-muted-foreground">{item.answer}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <StaticCtaCard title={t('ctaHeading')} description={t('ctaBody')}>
        <Link
          href="/sign-up"
          className="inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        >
          {t('ctaButton')}
        </Link>
      </StaticCtaCard>
    </>
  )
}
