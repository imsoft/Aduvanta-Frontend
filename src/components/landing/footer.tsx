const content = {
  'en-US': {
    description:
      'Modern customs and foreign trade operations platform. Replacing legacy software with a unified web solution.',
    product: 'Product',
    productLinks: [
      { label: 'Features', href: '#features' },
      { label: 'Modules', href: '#modules' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
    resources: 'Resources',
    resourceLinks: [
      { label: 'Anexo 22 Catalogs', href: '#modules' },
      { label: 'SAAI Error Codes', href: '#modules' },
      { label: 'Unit Converter', href: '#modules' },
      { label: 'TIGIE Lookup', href: '#modules' },
    ],
    company: 'Company',
    companyLinks: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: 'mailto:contacto@aduvanta.com' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
    rights: 'All rights reserved.',
  },
  'es-MX': {
    description:
      'Plataforma moderna de operaciones aduaneras y de comercio exterior. Reemplazando software legacy con una solucion web unificada.',
    product: 'Producto',
    productLinks: [
      { label: 'Funcionalidades', href: '#features' },
      { label: 'Modulos', href: '#modules' },
      { label: 'Precios', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
    resources: 'Recursos',
    resourceLinks: [
      { label: 'Catalogos Anexo 22', href: '#modules' },
      { label: 'Errores SAAI', href: '#modules' },
      { label: 'Conversor de Unidades', href: '#modules' },
      { label: 'Consulta TIGIE', href: '#modules' },
    ],
    company: 'Empresa',
    companyLinks: [
      { label: 'Acerca de', href: '#' },
      { label: 'Contacto', href: 'mailto:contacto@aduvanta.com' },
      { label: 'Politica de Privacidad', href: '#' },
      { label: 'Terminos de Servicio', href: '#' },
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

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  A
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Aduvanta
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.description}
            </p>
          </div>

          {[
            { title: t.product, links: t.productLinks },
            { title: t.resources, links: t.resourceLinks },
            { title: t.company, links: t.companyLinks },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {year} Aduvanta. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
