import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/ui/reveal'
import { StaticPageHero } from '@/components/landing/static-page-hero'
import { StaticCtaCard } from '@/components/landing/static-cta-card'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.consultaTigie.meta' })
  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    path: '/herramientas/consulta-tigie',
    keywords: t('keywords'),
  })
}

export default async function ConsultaTigiePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing.consultaTigie' })
  const tMeta = await getTranslations({ locale, namespace: 'landing.consultaTigie.meta' })
  const features = t.raw('features') as Array<{ title: string; description: string }>

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: tMeta('breadcrumbTools'), url: `${BASE_URL}/${locale}/herramientas/consulta-tigie` },
    { name: tMeta('breadcrumbTigie'), url: `${BASE_URL}/${locale}/herramientas/consulta-tigie` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <StaticPageHero title={t('title')} subtitle={t('subtitle')} width="md">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-lg transition-shadow hover:shadow-xl">
            <MagnifyingGlass
              size={20}
              className="ml-2 shrink-0 text-muted-foreground"
            />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
              disabled
            />
            <Link
              href="/sign-up"
              className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              {t('searchButton')}
            </Link>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t('signUpNote')}
          </p>
        </div>
      </StaticPageHero>

      <section className="border-t border-border/40 bg-muted/20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature, i) => (
              <Reveal
                key={feature.title}
                delay={80 * i}
                className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-8"
              >
                <h2 className="text-lg font-semibold transition-colors group-hover:text-primary">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StaticCtaCard title={t('ctaTitle')} description={t('ctaDescription')}>
        <Link
          href="/sign-up"
          className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
        >
          {t('ctaCta')}
          <ArrowRight
            size={16}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </StaticCtaCard>
    </>
  )
}
