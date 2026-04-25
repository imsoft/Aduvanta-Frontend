'use client'

import { useState } from 'react'
import { Check, ArrowRight } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'

type Tier = {
  name: string
  monthlyPrice: string
  annualPrice: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

export function PricingSection() {
  const [annual, setAnnual] = useState(true)
  const t = useTranslations('landing.pricing')
  const tiers = t.raw('tiers') as Tier[]

  return (
    <section id="pricing" className="border-y border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t('badge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{t('description')}</p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
            <button
              type="button"
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                !annual
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setAnnual(false)}
            >
              {t('monthly')}
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                annual
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setAnnual(true)}
            >
              {t('annual')}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                annual
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-primary/10 text-primary'
              }`}>
                {t('annualSave')}
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal
              key={tier.name}
              variant="scale"
              delay={80 * i}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                tier.highlighted
                  ? 'border-primary bg-card shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20'
                  : 'border-border/50 bg-card hover:border-border hover:shadow-lg'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 right-6">
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {t('popular')}
                  </span>
                </div>
              )}

              <h3 className="text-base font-semibold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {annual ? tier.annualPrice : tier.monthlyPrice}
                </span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`mt-7 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                {tier.cta}
                <ArrowRight size={14} weight="bold" />
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t('guarantee')}
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t('contact')}{' '}
          <a
            href="mailto:ventas@aduvanta.com"
            className="font-medium text-primary hover:underline"
          >
            {t('contactCta')}
          </a>
        </p>
      </div>
    </section>
  )
}
