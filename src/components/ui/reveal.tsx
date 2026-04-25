'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'up' | 'fade' | 'scale' | 'left' | 'right'

interface RevealProps {
  children: ReactNode
  variant?: Variant
  /** Retraso en ms. Se traduce a clases `reveal-delay-N` de 80ms. */
  delay?: number
  /** Fracción del elemento visible antes de disparar (0–1). */
  threshold?: number
  /** Si true, dispara una sola vez. */
  once?: boolean
  className?: string
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  threshold = 0.15,
  once = true,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -5% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once])

  const revealType = variant === 'up' ? 'true' : variant

  const delayStep = Math.min(6, Math.max(0, Math.round(delay / 80)))
  const delayClass = delayStep > 0 ? `reveal-delay-${delayStep}` : undefined

  return (
    <Tag
      ref={ref as never}
      data-reveal={revealType}
      data-visible={visible ? 'true' : 'false'}
      className={cn(delayClass, className)}
    >
      {children}
    </Tag>
  )
}
