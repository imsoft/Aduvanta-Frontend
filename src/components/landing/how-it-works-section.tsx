import {
  UserPlus,
  Buildings,
  Rocket,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/reveal'

type Step = {
  number: string
  title: string
  description: string
}

const stepIcons: Icon[] = [UserPlus, Buildings, Rocket]

export function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks')
  const steps = t.raw('steps') as Step[]

  return (
    <section className="border-y border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t('badge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:mt-16 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => {
            const IconComp = stepIcons[i] ?? UserPlus
            return (
              <Reveal
                key={step.number}
                delay={80 * (i + 1)}
                className="group relative text-center md:text-left"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary/15 group-hover:ring-primary/30 md:mx-0">
                  <IconComp size={22} weight="duotone" className="text-primary" />
                </div>
                <div className="mt-2 text-xs font-bold text-primary/50">{step.number}</div>
                <h3 className="mt-1 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
