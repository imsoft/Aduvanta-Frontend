import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type FooterLink = {
  label: string
  href: string
}

export function LandingFooter() {
  const t = useTranslations('landing.footer')
  const year = new Date().getFullYear()

  const productLinks = t.raw('productLinks') as FooterLink[]
  const toolLinks = t.raw('toolLinks') as FooterLink[]
  const companyLinks = t.raw('companyLinks') as FooterLink[]

  const sections = [
    { title: t('productTitle'), links: productLinks },
    { title: t('toolsTitle'), links: toolLinks },
    { title: t('companyTitle'), links: companyLinks },
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
              {t('tagline')}
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => {
                  const isExternal = link.href.startsWith('mailto:') || link.href.startsWith('http')
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/30 pt-6">
          <p className="text-xs text-muted-foreground/60">
            &copy; {year} Aduvanta. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
