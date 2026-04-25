'use client'

import { useState } from 'react'
import { Plus, Minus } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

type FaqItem = {
  question: string
  answer: string
}

export function FaqSection() {
  const t = useTranslations('landing.faq')
  const items = t.raw('items') as FaqItem[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="border-t border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-[280px_1fr] md:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t('badge')}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {t('title')}
            </h2>
          </div>

          <div className="divide-y divide-border/40">
            {items.map((item, index) => (
              <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="text-sm font-semibold sm:text-base">
                    {item.question}
                  </span>
                  {openIndex === index ? (
                    <Minus size={16} weight="bold" className="mt-1 shrink-0 text-primary" />
                  ) : (
                    <Plus size={16} weight="bold" className="mt-1 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openIndex === index && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
