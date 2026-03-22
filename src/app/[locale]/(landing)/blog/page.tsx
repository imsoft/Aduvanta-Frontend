import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { getAllPosts } from '@/data/blog/posts'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  return buildPageMetadata({
    locale,
    title:
      locale === 'es-MX'
        ? 'Blog — Comercio Exterior y Software Aduanal'
        : 'Blog — Foreign Trade & Customs Software',
    description:
      locale === 'es-MX'
        ? 'Articulos, guias y consejos sobre pedimentos, clasificacion arancelaria, TIGIE, comercio exterior y operaciones aduanales en Mexico.'
        : 'Articles, guides, and tips about pedimentos, tariff classification, TIGIE, foreign trade, and customs operations in Mexico.',
    path: '/blog',
    keywords:
      locale === 'es-MX'
        ? 'blog aduanal, pedimentos, clasificacion arancelaria, comercio exterior Mexico, TIGIE, software aduanal'
        : 'customs blog, pedimentos, tariff classification, Mexico foreign trade, TIGIE, customs software',
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
  const lang = locale === 'es-MX' ? 'es-MX' : 'en-US'
  const posts = getAllPosts()

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: locale === 'es-MX' ? 'Inicio' : 'Home',
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

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {locale === 'es-MX'
            ? 'Guias, consejos y novedades sobre comercio exterior y operaciones aduanales en Mexico.'
            : 'Guides, tips, and news about foreign trade and customs operations in Mexico.'}
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs text-muted-foreground">
                  {post.readingTime} min · {formatDate(post.date, locale)}
                </span>

                <h2 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
                  {post.title[lang]}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.description[lang]}
                </p>

                <span className="mt-4 text-sm font-medium text-primary group-hover:underline">
                  {locale === 'es-MX' ? 'Leer mas' : 'Read more'} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
