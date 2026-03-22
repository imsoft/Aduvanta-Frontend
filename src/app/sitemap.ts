import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'

const locales = ['en-US', 'es-MX'] as const

function localizedEntry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
      ),
    },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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

    // Blog
    ...localizedEntry('/blog', 'daily', 0.7),
    ...localizedEntry('/blog/que-es-un-pedimento-aduanal', 'monthly', 0.6),
    ...localizedEntry('/blog/clasificacion-arancelaria-tigie-guia', 'monthly', 0.6),
    ...localizedEntry('/blog/software-aduanal-vs-excel', 'monthly', 0.6),

    // Tools
    ...localizedEntry('/herramientas/consulta-tigie', 'monthly', 0.7),

    // Legal
    ...localizedEntry('/privacidad', 'yearly', 0.3),
    ...localizedEntry('/terminos', 'yearly', 0.3),
  ]
}
