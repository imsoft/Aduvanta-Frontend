import Image from 'next/image'
import {
  FileText,
  Users,
  ShieldCheck,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/reveal'

type Feature = {
  iconKey: string
  badge: string
  title: string
  description: string
  bullets: string[]
  imageSrc: string
  imageAlt: string
}

const iconMap: Record<string, Icon> = {
  fileText: FileText,
  users: Users,
  shieldCheck: ShieldCheck,
  sparkle: Sparkle,
}

export function FeaturesSection() {
  const t = useTranslations('landing.features')
  const items = t.raw('items') as Feature[]

  return (
    <section id="product" className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t('sectionBadge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t('sectionTitle')}
          </h2>
        </Reveal>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
          {items.map((feature, i) => {
            const reversed = i % 2 === 1
            const IconComp = iconMap[feature.iconKey] ?? FileText
            return (
              <div
                key={feature.badge}
                className={`flex flex-col items-center gap-10 md:flex-row md:gap-16 ${
                  reversed ? 'md:flex-row-reverse' : ''
                }`}
              >
                <Reveal variant={reversed ? 'right' : 'left'} className="flex-1">
                  <div className="flex items-center gap-2">
                    <IconComp size={16} weight="duotone" className="text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {feature.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {feature.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal
                  variant={reversed ? 'left' : 'right'}
                  delay={120}
                  className="w-full flex-1"
                >
                  <div className="group relative">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-2 -z-10 rounded-2xl bg-linear-to-br from-primary/10 via-chart-1/10 to-chart-2/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted/30 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
