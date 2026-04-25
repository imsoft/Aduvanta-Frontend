import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'
import { StaticPageHero } from '@/components/landing/static-page-hero'
import { StaticCtaCard } from '@/components/landing/static-cta-card'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.clasificacionArancelaria.meta' })
  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    path: '/clasificacion-arancelaria',
    keywords: t('keywords'),
  })
}

type FeatureItem = { title: string; description: string }

export default async function ClasificacionArancelariaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing.clasificacionArancelaria' })
  const tCommon = await getTranslations({ locale, namespace: 'landing.common' })
  const features = t.raw('features') as FeatureItem[]
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t('breadcrumbTitle'), url: `${BASE_URL}/${locale}/clasificacion-arancelaria` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <StaticPageHero title={t('hero.heading')} subtitle={t('hero.subheading')} width="md" />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={80 * i}
              className="group rounded-2xl border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
                {feature.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <StaticCtaCard title={t('cta.heading')} description={t('cta.description')}>
        <Link
          href="/sign-up"
          className="inline-block rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        >
          {tCommon('getStarted')}
        </Link>
      </StaticCtaCard>
    </>
  )
}
