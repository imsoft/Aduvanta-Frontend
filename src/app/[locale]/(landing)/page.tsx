import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/landing/hero-section'
import { LogoBar } from '@/components/landing/logo-bar'
import { ProblemSection } from '@/components/landing/problem-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PlatformSection } from '@/components/landing/platform-section'
import { ComparisonSection } from '@/components/landing/comparison-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.home.meta' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'en-US': `${BASE_URL}/en-US`,
        'es-MX': `${BASE_URL}/es-MX`,
        'x-default': `${BASE_URL}/en-US`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}`,
      type: 'website',
      siteName: 'Aduvanta',
      locale: locale === 'es-MX' ? 'es_MX' : 'en_US',
      alternateLocale: locale === 'es-MX' ? 'en_US' : 'es_MX',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t('ogAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${BASE_URL}/og-image.png`],
    },
  }
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const tSchema = await getTranslations({ locale, namespace: 'landing.home.schema' })
  const tFaq = await getTranslations({ locale, namespace: 'landing.home' })
  const faqItems = tFaq.raw('faq') as Array<{ question: string; answer: string }>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Aduvanta',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${BASE_URL}/${locale}`,
    description: tSchema('description'),
    applicationSubCategory: tSchema('applicationSubCategory'),
    featureList: tSchema('featureList'),
    screenshot: `${BASE_URL}/og-image.png`,
    inLanguage: locale === 'es-MX' ? 'es-MX' : 'en-US',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MXN',
      lowPrice: '2000',
      highPrice: '35000',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '12',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'es-MX' ? 'es-MX' : 'en-US',
    mainEntity: faqItems.map((item) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <LogoBar />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PlatformSection />
      <ComparisonSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
