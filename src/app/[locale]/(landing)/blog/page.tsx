import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata, BASE_URL } from '@/lib/seo';
import { StaticPageHero } from '@/components/landing/static-page-hero';
import BlogPostsList from './blog-posts-list';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    ...buildPageMetadata({
      locale,
      title: t('metaTitle'),
      description: t('metaDescription'),
      path: '/blog',
      keywords: t('metaKeywords'),
    }),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${BASE_URL}/${locale}/blog`,
      type: 'website',
      siteName: 'Aduvanta',
      locale: locale === 'es-MX' ? 'es_MX' : 'en_US',
      alternateLocale: locale === 'es-MX' ? 'en_US' : 'es_MX',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: t('metaTitle') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('metaTitle'),
    description: t('metaDescription'),
    url: `${BASE_URL}/${locale}/blog`,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'Aduvanta',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/brand/aduvanta-light.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <StaticPageHero
        title={t('title')}
        subtitle={t('subtitle')}
        width="md"
        align="left"
      />
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <BlogPostsList locale={locale} />
      </section>
    </>
  );
}
