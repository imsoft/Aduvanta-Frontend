import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  Check,
  ShieldCheck,
  FileText,
  Users,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/ui/reveal'
import { StaticPageHero } from '@/components/landing/static-page-hero'
import { StaticCtaCard } from '@/components/landing/static-cta-card'

type ModuleItem = { name: string; description: string }
type Pain = { title: string; description: string }
type Diff = { iconKey: string; title: string; description: string }

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.softwareAduanal.meta' })
  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    path: '/software-aduanal',
    keywords: t('keywords'),
  })
}

export default async function SoftwareAduanalPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing.softwareAduanal' })

  const pains = t.raw('pains') as Pain[]
  const mods = t.raw('modules') as ModuleItem[]
  const diffs = t.raw('diffs') as Diff[]

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t('title'), url: `${BASE_URL}/${locale}/software-aduanal` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <StaticPageHero title={t('title')} subtitle={t('heroSubtitle')} width="md">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            {t('heroCta')}
            <ArrowRight
              size={18}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/precios"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-muted"
          >
            {t('heroSecondaryCta')}
          </Link>
        </div>
      </StaticPageHero>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">{t('painTitle')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t('painSubtitle')}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pains.map((pain, i) => (
              <Reveal
                key={pain.title}
                delay={80 * i}
                className="group rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <h3 className="font-semibold transition-colors group-hover:text-primary">
                  {pain.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pain.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              {t('modulesTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t('modulesSubtitle')}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mods.map((mod, i) => (
              <Reveal
                key={mod.name}
                delay={60 * (i % 6)}
                className="group flex gap-3 rounded-lg border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                  <Check size={20} weight="bold" className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{mod.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mod.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">{t('diffTitle')}</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {diffs.map((diff, i) => (
              <Reveal
                key={diff.title}
                variant={i % 2 === 0 ? 'left' : 'right'}
                delay={100 * i}
                className="group flex gap-4 rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="shrink-0 transition-transform group-hover:scale-110">
                  {diff.iconKey === 'shield' && (
                    <ShieldCheck size={28} className="text-primary" />
                  )}
                  {diff.iconKey === 'users' && (
                    <Users size={28} className="text-primary" />
                  )}
                  {diff.iconKey === 'sparkle' && (
                    <Sparkle size={28} className="text-primary" />
                  )}
                  {diff.iconKey === 'cloud' && (
                    <FileText size={28} className="text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{diff.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {diff.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('socialTitle')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('socialDescription')}</p>
        </Reveal>
      </section>

      <StaticCtaCard title={t('ctaTitle')} description={t('ctaDescription')}>
        <Link
          href="/sign-up"
          className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        >
          {t('ctaButton')}
          <ArrowRight
            size={18}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </StaticCtaCard>
    </>
  )
}
