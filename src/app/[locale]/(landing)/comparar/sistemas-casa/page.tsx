import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'
import { StaticPageHero } from '@/components/landing/static-page-hero'
import { StaticCtaCard } from '@/components/landing/static-cta-card'

type ComparisonRow = {
  feature: string
  aduvanta: boolean | string
  casa: boolean | string
}

type SummaryItem = { heading: string; body: string }

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm">{value}</span>
  }
  if (value) {
    return (
      <svg
        className="mx-auto h-5 w-5 text-green-600 dark:text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    )
  }
  return (
    <svg
      className="mx-auto h-5 w-5 text-red-500 dark:text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.compararCasa.meta' })
  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    path: '/comparar/sistemas-casa',
    keywords: t('keywords'),
  })
}

export default async function CompararSistemasCasaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing.compararCasa' })
  const tMeta = await getTranslations({ locale, namespace: 'landing.compararCasa.meta' })
  const rows = t.raw('rows') as ComparisonRow[]
  const summaryItems = t.raw('summaryItems') as SummaryItem[]

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    {
      name: tMeta('breadcrumbCompare'),
      url: `${BASE_URL}/${locale}/comparar`,
    },
    {
      name: 'Sistemas CASA',
      url: `${BASE_URL}/${locale}/comparar/sistemas-casa`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <StaticPageHero
        title={t('heading')}
        subtitle={t('subheading')}
        width="md"
      />

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('introTitle')}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {t('introBody')}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <Reveal
          variant="scale"
          className="overflow-x-auto rounded-xl border shadow-sm"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-4 text-sm font-semibold">
                  {t('tableFeature')}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Aduvanta
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Sistemas CASA
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`${i % 2 === 0 ? 'bg-background' : 'bg-muted/30'} transition-colors hover:bg-primary/5`}
                >
                  <td className="px-6 py-3 text-sm">{row.feature}</td>
                  <td className="px-6 py-3 text-center">
                    <CellValue value={row.aduvanta} />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <CellValue value={row.casa} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('summaryTitle')}
          </h2>
        </Reveal>
        <div className="mt-8 space-y-8">
          {summaryItems.map((item, i) => (
            <Reveal key={item.heading} delay={80 * i}>
              <h3 className="text-lg font-semibold">{item.heading}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <StaticCtaCard title={t('ctaHeading')} description={t('ctaBody')}>
        <Link
          href="/sign-up"
          className="inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        >
          {t('ctaButton')}
        </Link>
        <Link
          href="/precios"
          className="inline-block rounded-lg border border-border bg-background/70 px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t('ctaPricing')}
        </Link>
      </StaticCtaCard>
    </>
  )
}
