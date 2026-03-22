import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { getAllPosts, getPostBySlug } from '@/data/blog/posts'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  const posts = getAllPosts()
  const locales = ['en-US', 'es-MX'] as const
  return posts.flatMap((post) =>
    locales.map((locale) => ({ locale, slug: post.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const lang = locale === 'es-MX' ? 'es-MX' : 'en-US'
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: 'Not found' }
  }

  return buildPageMetadata({
    locale,
    title: post.title[lang],
    description: post.description[lang],
    path: `/blog/${post.slug}`,
    keywords: post.keywords[lang],
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

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const lang = locale === 'es-MX' ? 'es-MX' : 'en-US'
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: locale === 'es-MX' ? 'Inicio' : 'Home',
      url: `${BASE_URL}/${locale}`,
    },
    {
      name: 'Blog',
      url: `${BASE_URL}/${locale}/blog`,
    },
    {
      name: post.title[lang],
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
    },
  ])

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title[lang],
    description: post.description[lang],
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aduvanta',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/blog/${post.slug}`,
    },
    inLanguage: locale === 'es-MX' ? 'es' : 'en',
    keywords: post.keywords[lang],
  }

  const paragraphs = post.content[lang].split('\n\n')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <header className="mb-10">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {locale === 'es-MX' ? 'Inicio' : 'Home'}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{post.title[lang]}</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title[lang]}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <time dateTime={post.date}>
              {formatDate(post.date, locale)}
            </time>
            <span>{post.readingTime} min</span>
          </div>
        </header>

        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="mt-14 rounded-2xl border border-primary/20 bg-primary/[0.03] p-8 text-center">
          <h2 className="text-2xl font-bold">
            {locale === 'es-MX'
              ? 'Prueba Aduvanta gratis'
              : 'Try Aduvanta for free'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {locale === 'es-MX'
              ? 'Simplifica tus operaciones aduanales con validaciones automaticas, TIGIE integrada y calculo de impuestos en tiempo real. 14 dias gratis, sin tarjeta de credito.'
              : 'Simplify your customs operations with automatic validations, integrated TIGIE, and real-time tax calculations. 14-day free trial, no credit card required.'}
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {locale === 'es-MX' ? 'Comenzar gratis' : 'Start for free'}
          </Link>
        </aside>

        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold">
              {locale === 'es-MX'
                ? 'Articulos relacionados'
                : 'Related articles'}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-border/50 bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                    {related.title[lang]}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {related.description[lang]}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <time dateTime={related.date}>
                      {formatDate(related.date, locale)}
                    </time>
                    <span className="mx-1">&middot;</span>
                    <span>{related.readingTime} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
