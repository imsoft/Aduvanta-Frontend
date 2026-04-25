import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

const ORGANIZATION_DESCRIPTIONS: Record<string, string> = {
  'en-US':
    '100% web-based customs software for customs brokers in Mexico.',
  'es-MX':
    'Software aduanal 100% web para agencias aduanales en México.',
}

function buildOrganizationJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aduvanta',
    url: 'https://aduvanta.com',
    logo: 'https://aduvanta.com/logo.png',
    description:
      ORGANIZATION_DESCRIPTIONS[locale] ?? ORGANIZATION_DESCRIPTIONS['en-US'],
    inLanguage: locale,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contacto@aduvanta.com',
      contactType: 'sales',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [],
  }
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()
  const organizationJsonLd = buildOrganizationJsonLd(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
