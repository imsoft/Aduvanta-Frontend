import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'

const ORGANIZATION_DESCRIPTIONS: Record<string, string> = {
  'en-US': '100% web-based customs software for customs brokers in Mexico. Pedimentos, TIGIE tariff classification, Annex 22, client portal, invoicing, and auditing in one platform.',
  'es-MX': 'Software aduanal 100% web para agencias aduanales en México. Pedimentos, clasificación arancelaria TIGIE, Anexo 22, portal de clientes, facturación y auditoría en una sola plataforma.',
}

function buildOrganizationJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aduvanta',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/brand/aduvanta-light.png`,
      width: 6250,
      height: 6250,
    },
    description: ORGANIZATION_DESCRIPTIONS[locale] ?? ORGANIZATION_DESCRIPTIONS['en-US'],
    inLanguage: locale,
    foundingDate: '2024',
    areaServed: 'MX',
    knowsAbout: ['Customs Brokerage', 'Pedimentos', 'TIGIE', 'Anexo 22', 'Customs Software'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contacto@aduvanta.com',
      contactType: 'customer support',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [
      'https://www.linkedin.com/company/aduvanta',
    ],
  }
}

function buildWebSiteJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Aduvanta',
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/herramientas/consulta-tigie?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
  const webSiteJsonLd = buildWebSiteJsonLd(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
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
