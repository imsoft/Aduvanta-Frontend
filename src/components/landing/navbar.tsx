'use client'

import { useState, useEffect } from 'react'
import { List, X, Globe } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/brand/logo'

type Props = {
  locale: string
}

export function LandingNavbar({ locale }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('landing.navbar')
  const altLocale = locale === 'es-MX' ? 'en-US' : 'es-MX'

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#product', label: t('product') },
    { href: '#pricing', label: t('pricing') },
    { href: '#compare', label: t('compare') },
    { href: '#faq', label: t('faq') },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8"
        aria-label={t('mainNavigation')}
      >
        <a href={`/${locale}`} className="flex items-center gap-2.5" aria-label={t('brandHome')}>
          <Logo size={42} />
          <span className="text-lg font-bold tracking-tight">Aduvanta</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <a
            href={`/${altLocale}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t('switchLocaleLabel')}
          >
            <Globe size={14} weight="bold" />
            {t('switchLocale')}
          </a>
          <Link
            href="/sign-in"
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('signIn')}
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            {t('cta')}
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/40 bg-background px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-4">
            <div className="flex items-center justify-between px-3">
              <a
                href={`/${altLocale}`}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
              >
                <Globe size={14} weight="bold" />
                {t('switchLocaleLabel')}
              </a>
            </div>
            <Link
              href="/sign-in"
              className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t('signIn')}
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
