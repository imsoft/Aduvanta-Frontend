'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  /** Valor numérico final. Si se pasa string no numérico, se renderiza tal cual. */
  value: string
  durationMs?: number
  className?: string
}

/**
 * Anima un número entero desde 0 hasta `value` cuando el elemento entra en
 * el viewport. Preserva prefijos y sufijos no numéricos (ej. `%`).
 */
export function AnimatedCounter({
  value,
  durationMs = 1400,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(value)
  const startedRef = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/)
    if (!match) {
      setDisplay(value)
      return
    }
    const [, prefix, numStr, suffix] = match
    const target = Number(numStr)

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || target === 0) {
      setDisplay(value)
      return
    }

    setDisplay(`${prefix}0${suffix}`)

    const start = () => {
      if (startedRef.current) return
      startedRef.current = true

      const startTs = performance.now()
      const animate = (now: number) => {
        const elapsed = now - startTs
        const progress = Math.min(1, elapsed / durationMs)
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(target * eased)
        setDisplay(`${prefix}${current}${suffix}`)
        if (progress < 1) requestAnimationFrame(animate)
        else setDisplay(value)
      }
      requestAnimationFrame(animate)
    }

    if (typeof IntersectionObserver === 'undefined') {
      start()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            start()
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value, durationMs])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
