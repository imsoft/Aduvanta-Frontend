import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/reveal'

type Testimonial = {
  quote: string
  name: string
  role: string
}

export function TestimonialsSection() {
  const t = useTranslations('landing.testimonials')
  const items = t.raw('items') as Testimonial[]

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t('badge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={item.name}
              delay={80 * i}
              as="article"
              className="group flex flex-col rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <figure className="flex h-full flex-col">
                <blockquote className="flex-1">
                  <p className="text-sm leading-relaxed text-foreground/80">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-5 border-t border-border/30 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary/15 group-hover:ring-primary/30">
                      <span className="text-xs font-bold text-primary">
                        {item.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
