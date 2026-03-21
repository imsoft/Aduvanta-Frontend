import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { ModulesSection } from '@/components/landing/modules-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aduvanta — Modern Customs Operations Platform',
  description:
    'Replace legacy customs software with a unified web platform. Pedimentos, operations, documents, billing, and more for Mexican customs agencies.',
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params

  return (
    <>
      <HeroSection locale={locale} />
      <FeaturesSection locale={locale} />
      <ModulesSection locale={locale} />
      <PricingSection locale={locale} />
      <FaqSection locale={locale} />
      <CtaSection locale={locale} />
    </>
  )
}
