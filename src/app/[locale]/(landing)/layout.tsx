import { setRequestLocale } from 'next-intl/server'
import { LandingNavbar } from '@/components/landing/navbar'
import { LandingFooter } from '@/components/landing/footer'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LandingLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar locale={locale} />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  )
}
