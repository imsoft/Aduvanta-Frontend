import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'

type Section = { heading: string; body: string }

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.terminos.meta' })
  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    path: '/terminos',
  })
}

export default async function TerminosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing.terminos' })
  const sections = t.raw('sections') as Section[]

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t('title'), url: `${BASE_URL}/${locale}/terminos` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <section className="relative mx-auto max-w-3xl px-6 py-20">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 overflow-hidden"
          aria-hidden="true"
        >
          <div className="animate-aurora absolute -top-24 left-1/2 h-80 w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <h1 className="animate-fade-up text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h1>
        <p className="animate-fade-up reveal-delay-1 mt-2 text-sm text-muted-foreground">
          {t('lastUpdated')}
        </p>
        <p className="animate-fade-up reveal-delay-2 mt-6 leading-relaxed text-muted-foreground">
          {t('intro')}
        </p>

        {sections.map((section, i) => (
          <Reveal
            key={section.heading}
            delay={Math.min(i * 40, 240)}
            className="mt-10"
          >
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
              {section.body.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        ))}

        <div className="mt-16 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            {t('privacyLinkPrefix')}
            <Link
              href="/privacidad"
              className="underline hover:text-foreground"
            >
              {t('privacyLinkText')}
            </Link>
            {t('privacyLinkSuffix')}
          </p>
        </div>
      </section>
    </>
  )
}
