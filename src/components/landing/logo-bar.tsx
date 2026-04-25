import { useTranslations } from 'next-intl'

const logos = [
  'Agencia Alpha',
  'Comercio MX',
  'Global Trade',
  'Aduanas Pro',
  'LogisMex',
] as const

export function LogoBar() {
  const t = useTranslations('landing.logoBar')

  return (
    <section className="border-y border-border/40 bg-muted/20 py-10">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
          {t('label')}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
          {logos.map((name) => (
            <div
              key={name}
              className="text-base font-semibold tracking-tight text-muted-foreground/40 sm:text-lg"
              aria-hidden="true"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
