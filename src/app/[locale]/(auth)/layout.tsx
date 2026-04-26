import { Link } from '@/i18n/navigation'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

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
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} weight="bold" />
          Aduvanta
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
