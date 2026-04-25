import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { getAllPosts } from '@/data/blog/posts'
import { Reveal } from '@/components/ui/reveal'
import { StaticPageHero } from '@/components/landing/static-page-hero'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.blog.meta' })

  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    path: '/blog',
    keywords: t('keywords'),
  })
}

function formatDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString(locale === 'es-MX' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing.blog' })
  const lang = locale === 'es-MX' ? 'es-MX' : 'en-US'
  const posts = getAllPosts()

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: t('home'),
      url: `${BASE_URL}/${locale}`,
    },
    {
      name: 'Blog',
      url: `${BASE_URL}/${locale}/blog`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <StaticPageHero
        title="Blog"
        subtitle={t('subtitle')}
        width="md"
        align="left"
      />

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal
              key={post.slug}
              delay={60 * i}
              className="h-full"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs text-muted-foreground">
                    {post.readingTime} {t('readingTimeSuffix')} ·{' '}
                    {formatDate(post.date, locale)}
                  </span>

                  <h2 className="mt-3 text-lg font-semibold transition-colors group-hover:text-primary">
                    {post.title[lang]}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.description[lang]}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                    {t('readMore')} <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
