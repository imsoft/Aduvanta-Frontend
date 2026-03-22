import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'

type PageSeoParams = {
  locale: string
  title: string
  description: string
  path: string
  keywords?: string
  noindex?: boolean
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  keywords,
  noindex,
}: PageSeoParams): Metadata {
  const url = `${BASE_URL}/${locale}${path}`
  const altLocale = locale === 'es-MX' ? 'en-US' : 'es-MX'

  return {
    title,
    description,
    ...(keywords && { keywords }),
    ...(noindex && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: url,
      languages: {
        'en-US': `${BASE_URL}/en-US${path}`,
        'es-MX': `${BASE_URL}/es-MX${path}`,
        'x-default': `${BASE_URL}/en-US${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
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
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  }
}

type BreadcrumbItem = {
  name: string
  url: string
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export { BASE_URL }
