import { Link } from '@/i18n/navigation'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/brand/logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <div className="absolute left-4 top-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-opacity hover:opacity-80"
          aria-label="Ir a inicio"
        >
          <Logo size={36} />
          <span className="text-sm font-semibold">Aduvanta</span>
        </Link>
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
      {children}
    </div>
  )
}
