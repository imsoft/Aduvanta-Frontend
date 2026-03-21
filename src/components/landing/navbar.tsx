'use client'

import { useState } from 'react'
import { List, X } from '@phosphor-icons/react'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    features: 'Features',
    modules: 'Modules',
    pricing: 'Pricing',
    faq: 'FAQ',
    signIn: 'Sign In',
    getStarted: 'Get Started',
  },
  'es-MX': {
    features: 'Funcionalidades',
    modules: 'Modulos',
    pricing: 'Precios',
    faq: 'FAQ',
    signIn: 'Iniciar Sesion',
    getStarted: 'Comenzar',
  },
} as const

type Props = {
  locale: string
}

export function LandingNavbar({ locale }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Aduvanta</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: '#features', label: t.features },
            { href: '#modules', label: t.modules },
            { href: '#pricing', label: t.pricing },
            { href: '#faq', label: t.faq },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.signIn}
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
          >
            {t.getStarted}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2">
            {[
              { href: '#features', label: t.features },
              { href: '#modules', label: t.modules },
              { href: '#pricing', label: t.pricing },
              { href: '#faq', label: t.faq },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-3">
              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t.signIn}
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground shadow-sm"
              >
                {t.getStarted}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
