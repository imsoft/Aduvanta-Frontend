import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    tagline: 'The modern customs operations platform.',
    product: 'Product',
    productLinks: [
      { label: 'Features', href: '#product' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Compare', href: '#compare' },
      { label: 'FAQ', href: '#faq' },
    ],
    tools: 'Free Tools',
    toolLinks: [
      { label: 'TIGIE Lookup', href: '/sign-up' },
      { label: 'Anexo 22 Catalogs', href: '/sign-up' },
      { label: 'SAAI Error Codes', href: '/sign-up' },
      { label: 'Unit Converter', href: '/sign-up' },
    ],
    company: 'Company',
    companyLinks: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: 'mailto:contacto@aduvanta.com' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
    rights: 'All rights reserved.',
  },
  'es-MX': {
    tagline: 'La plataforma moderna de operaciones aduaneras.',
    product: 'Producto',
    productLinks: [
      { label: 'Funcionalidades', href: '#product' },
      { label: 'Precios', href: '#pricing' },
      { label: 'Comparar', href: '#compare' },
      { label: 'FAQ', href: '#faq' },
    ],
    tools: 'Herramientas Gratis',
    toolLinks: [
      { label: 'Consulta TIGIE', href: '/sign-up' },
      { label: 'Catalogos Anexo 22', href: '/sign-up' },
      { label: 'Errores SAAI', href: '/sign-up' },
      { label: 'Conversor de Unidades', href: '/sign-up' },
    ],
    company: 'Empresa',
    companyLinks: [
      { label: 'Acerca de', href: '#' },
      { label: 'Contacto', href: 'mailto:contacto@aduvanta.com' },
      { label: 'Privacidad', href: '#' },
      { label: 'Terminos', href: '#' },
    ],
    rights: 'Todos los derechos reservados.',
  },
} as const

type Props = {
  locale: string
}

export function LandingFooter({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const year = new Date().getFullYear()

  const sections = [
    { title: t.product, links: t.productLinks, useRouter: false },
    { title: t.tools, links: t.toolLinks, useRouter: true },
    { title: t.company, links: t.companyLinks, useRouter: false },
  ]

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <span className="text-xs font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-base font-bold tracking-tight">Aduvanta</span>
            </div>
            <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
              {t.tagline}
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {section.useRouter ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/30 pt-6">
          <p className="text-xs text-muted-foreground/60">
            &copy; {year} Aduvanta. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
