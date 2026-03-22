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
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'

const meta = {
  'en-US': {
    title: 'Cloud Customs Software for Mexico | Pedimentos, TIGIE & Client Portal',
    description:
      'Aduvanta is web-based customs software for Mexican customs agencies. Pedimentos, TIGIE tariff classification, Anexo 22, client portal, billing and audit — one platform. 14-day free trial.',
    keywords:
      'customs software Mexico, pedimentos software, software aduanal, customs operations platform, TIGIE classification, Anexo 22, customs agency software, comercio exterior',
  },
  'es-MX': {
    title: 'Software Aduanal en la Nube | Pedimentos, TIGIE y Portal de Clientes',
    description:
      'Aduvanta es el software aduanal 100% web para agencias aduanales en Mexico. Pedimentos, clasificacion arancelaria TIGIE, Anexo 22, portal de clientes, facturacion y auditoria — todo en una plataforma. Prueba gratis 14 dias.',
    keywords:
      'software aduanal, software aduanal Mexico, sistema aduanero, software para pedimentos, comercio exterior software, agencia aduanal software, clasificacion arancelaria, TIGIE, Anexo 22',
  },
} as const

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = locale === 'es-MX' ? meta['es-MX'] : meta['en-US']

  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'en-US': `${BASE_URL}/en-US`,
        'es-MX': `${BASE_URL}/es-MX`,
        'x-default': `${BASE_URL}/en-US`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
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
          alt: 'Aduvanta — Software Aduanal',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [`${BASE_URL}/og-image.png`],
    },
  }
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params

  const faqItems =
    locale === 'es-MX'
      ? [
          {
            question: 'Cuanto tiempo toma empezar?',
            answer:
              'Unos 15 minutos. Registrate, crea tu organizacion, invita a tu equipo y puedes empezar a crear pedimentos inmediatamente.',
          },
          {
            question: 'Puedo migrar mis datos de CASA u otros sistemas?',
            answer:
              'Si. Ofrecemos migracion guiada para planes Professional y Enterprise.',
          },
          {
            question: 'Mis datos estan seguros?',
            answer:
              'Tus datos estan encriptados en reposo y en transito, con respaldos automaticos diarios y control de acceso por roles.',
          },
          {
            question: 'Mis clientes pueden acceder a la plataforma?',
            answer:
              'Si. El Portal de Clientes le da a cada cliente su propio acceso para rastrear operaciones y ver documentos.',
          },
          {
            question: 'Que pasa despues de los 14 dias de prueba?',
            answer:
              'Eliges un plan y continuas con todos tus datos intactos. Sin cargos sorpresa.',
          },
          {
            question: 'Necesito instalar algo?',
            answer:
              'No. Aduvanta funciona en cualquier navegador moderno. Sin descargas, sin plugins.',
          },
        ]
      : [
          {
            question: 'How long does it take to get started?',
            answer:
              'About 15 minutes. Sign up, create your organization, invite your team, and start creating pedimentos immediately.',
          },
          {
            question: 'Can I migrate my data from CASA or other systems?',
            answer:
              'Yes. We offer guided migration for Professional and Enterprise plans.',
          },
          {
            question: 'Is my data safe?',
            answer:
              'Your data is encrypted at rest and in transit, with automated daily backups and role-based access control.',
          },
          {
            question: 'Can my clients access the platform?',
            answer:
              'Yes. The Client Portal gives each client their own login to track operations and view documents.',
          },
          {
            question: 'What happens after the 14-day trial?',
            answer:
              'You choose a plan and continue with all your data intact. No surprise charges.',
          },
          {
            question: 'Do I need to install anything?',
            answer:
              'No. Aduvanta works in any modern browser. No downloads, no plugins.',
          },
        ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Aduvanta',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${BASE_URL}/${locale}`,
    description:
      locale === 'es-MX'
        ? 'Software aduanal 100% web para agencias aduanales en Mexico. Pedimentos, clasificacion arancelaria TIGIE, Anexo 22, portal de clientes, facturacion y auditoria.'
        : 'Web-based customs software for Mexican customs agencies. Pedimentos, TIGIE tariff classification, Anexo 22, client portal, billing and audit.',
    applicationSubCategory:
      locale === 'es-MX' ? 'Software Aduanal' : 'Customs Software',
    featureList:
      locale === 'es-MX'
        ? 'Pedimentos, Clasificacion Arancelaria, TIGIE, Anexo 22, Portal de Clientes, Facturacion, Auditoria, Control de Almacenes'
        : 'Pedimentos, Tariff Classification, TIGIE, Anexo 22, Client Portal, Billing, Audit, Warehouse Control',
    screenshot: `${BASE_URL}/og-image.png`,
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
      <HeroSection locale={locale} />
      <LogoBar locale={locale} />
      <ProblemSection locale={locale} />
      <HowItWorksSection locale={locale} />
      <FeaturesSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <PlatformSection locale={locale} />
      <ComparisonSection locale={locale} />
      <PricingSection locale={locale} />
      <FaqSection locale={locale} />
      <CtaSection locale={locale} />
    </>
  )
}
