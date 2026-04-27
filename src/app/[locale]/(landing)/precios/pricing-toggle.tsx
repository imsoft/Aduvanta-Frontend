'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

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

type Props = {
  plans: Tier[]
  popular: string
  monthly: string
  annual: string
  annualSave: string
  currency: string
  signUpHref: string
  contactHref: string
}

export function PricingToggle({
  plans,
  popular,
  monthly,
  annual,
  annualSave,
  currency,
  signUpHref,
  contactHref,
}: Props) {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      {/* Toggle */}
      <div className="mb-10 flex items-center justify-center gap-3">
        <span className={cn('text-sm font-medium', !isAnnual ? 'text-foreground' : 'text-muted-foreground')}>
          {monthly}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isAnnual}
          onClick={() => setIsAnnual((v) => !v)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isAnnual ? 'bg-primary' : 'bg-muted-foreground/30',
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              isAnnual ? 'translate-x-6' : 'translate-x-1',
            )}
          />
        </button>
        <span className={cn('text-sm font-medium', isAnnual ? 'text-foreground' : 'text-muted-foreground')}>
          {annual}
        </span>
        {isAnnual && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {annualSave}
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan, i) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
          const isEnterprise = plan.cta.toLowerCase().includes('sales') || plan.cta.toLowerCase().includes('ventas')
          const href = isEnterprise ? contactHref : signUpHref

          return (
            <Reveal
              key={plan.name}
              variant="scale"
              delay={120 * i}
              className={cn(
                'relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                plan.highlighted
                  ? 'border-primary bg-primary/5 shadow-lg hover:shadow-primary/20'
                  : 'border-border bg-background',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                  {popular}
                </span>
              )}

              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                {isAnnual && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currency} {plan.annualPrice} × 12 = {
                      (() => {
                        const num = parseInt(plan.annualPrice.replace(/[$,]/g, ''), 10)
                        return `$${(num * 12).toLocaleString()}`
                      })()
                    } {currency}/yr
                  </p>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href={href}
                  className={cn(
                    'block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5',
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20'
                      : 'border border-border bg-background text-foreground hover:bg-muted',
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
