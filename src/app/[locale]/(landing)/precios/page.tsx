import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'
import { StaticPageHero } from '@/components/landing/static-page-hero'
import { StaticCtaCard } from '@/components/landing/static-cta-card'
import { PricingToggle } from './pricing-toggle'

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
      price: plan.monthlyPrice.replace(/[$,]/g, ''),
      priceCurrency: 'MXN',
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

      <PricingToggle
        plans={plans}
        popular={t('popular')}
        monthly={t('monthly')}
        annual={t('annual')}
        annualSave={t('annualSave')}
        currency={t('currency')}
        signUpHref="/sign-up"
        contactHref="/contacto"
      />

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
