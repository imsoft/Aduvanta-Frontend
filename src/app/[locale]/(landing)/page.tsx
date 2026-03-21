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

const meta = {
  'en-US': {
    title: 'Aduvanta — Modern Customs Operations Software for Mexico',
    description:
      'Replace legacy desktop customs software with one web platform. Pedimentos, tariff classification, documents, billing, client portal, and AI — all from your browser. 14-day free trial.',
    keywords:
      'customs software, pedimentos software, software aduanal, sistema aduanero Mexico, comercio exterior software, agencia aduanal software, TIGIE, Anexo 22',
  },
  'es-MX': {
    title: 'Aduvanta — Software Aduanal Moderno para Mexico',
    description:
      'Reemplaza el software aduanal de escritorio con una plataforma web. Pedimentos, clasificacion arancelaria, documentos, facturacion, portal de clientes e IA — todo desde tu navegador. 14 dias gratis.',
    keywords:
      'software aduanal, sistema aduanero Mexico, pedimentos software, comercio exterior software, agencia aduanal, TIGIE, Anexo 22, software de pedimentos',
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
    openGraph: {
      title: m.title,
      description: m.description,
      type: 'website',
      siteName: 'Aduvanta',
      locale: locale === 'es-MX' ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
    },
    alternates: {
      languages: {
        'en-US': '/en-US',
        'es-MX': '/es-MX',
      },
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
    description:
      locale === 'es-MX'
        ? 'Plataforma moderna de operaciones aduaneras para Mexico'
        : 'Modern customs operations platform for Mexico',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MXN',
      lowPrice: '2000',
      highPrice: '35000',
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
      <PlatformSection locale={locale} />
      <ComparisonSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <PricingSection locale={locale} />
      <FaqSection locale={locale} />
      <CtaSection locale={locale} />
    </>
  )
}
