import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

const locales = ['en-US', 'es-MX'] as const

function localizedEntry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
      ),
    },
  }))
}

async function fetchPublishedBlogPosts(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  try {
    const res = await fetch(`${API_BASE}/blog/posts?page=1&limit=200`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return FALLBACK_SLUGS
    const data = (await res.json()) as {
      posts: Array<{ slug: string; updatedAt: string }>
    }
    return data.posts ?? FALLBACK_SLUGS
  } catch {
    return FALLBACK_SLUGS
  }
}

const FALLBACK_SLUGS = [
  { slug: 'que-es-un-pedimento-aduanal', updatedAt: new Date().toISOString() },
  { slug: 'clasificacion-arancelaria-tigie-guia', updatedAt: new Date().toISOString() },
  { slug: 'software-aduanal-vs-excel', updatedAt: new Date().toISOString() },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await fetchPublishedBlogPosts()

  return [
    // Home
    ...localizedEntry('', 'weekly', 1.0),

    // Feature pages
    ...localizedEntry('/software-aduanal', 'monthly', 0.9),
    ...localizedEntry('/pedimentos', 'monthly', 0.8),
    ...localizedEntry('/clasificacion-arancelaria', 'monthly', 0.8),
    ...localizedEntry('/portal-clientes', 'monthly', 0.8),
    ...localizedEntry('/cumplimiento-aduanero', 'monthly', 0.8),

    // Pricing & comparison
    ...localizedEntry('/precios', 'monthly', 0.9),
    ...localizedEntry('/comparar/sistemas-casa', 'monthly', 0.7),

    // Blog index
    ...localizedEntry('/blog', 'daily', 0.7),

    // Blog posts — dynamically fetched from API
    ...blogPosts.flatMap((post) =>
      localizedEntry(
        `/blog/${post.slug}`,
        'monthly',
        0.6,
        new Date(post.updatedAt),
      ),
    ),

    // Tools
    ...localizedEntry('/herramientas/consulta-tigie', 'monthly', 0.7),

    // Legal
    ...localizedEntry('/privacidad', 'yearly', 0.3),
    ...localizedEntry('/terminos', 'yearly', 0.3),
  ]
}
