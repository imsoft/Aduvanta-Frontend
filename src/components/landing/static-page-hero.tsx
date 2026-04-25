import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StaticPageHeroProps {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
  /** Texto pequeño bajo el subtítulo (ej. "Última actualización: ..."). */
  meta?: ReactNode
  align?: 'center' | 'left'
  /** Ajusta el ancho máximo del contenido del hero. */
  width?: 'sm' | 'md' | 'lg'
  className?: string
}

const widthClass: Record<NonNullable<StaticPageHeroProps['width']>, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
}

/**
 * Hero estándar para páginas estáticas del landing. Renderiza un fondo con
 * auroras animadas + grid sutil (consistente con el hero principal), y
 * encadena animaciones `animate-fade-up` con stagger sobre el contenido.
 *
 * Es un RSC (sin `use client`): las animaciones dependen sólo de CSS.
 */
export function StaticPageHero({
  eyebrow,
  title,
  subtitle,
  children,
  meta,
  align = 'center',
  width = 'md',
  className,
}: StaticPageHeroProps) {
  const isCenter = align === 'center'
  return (
    <section
      className={cn(
        'relative overflow-hidden pb-16 pt-20 sm:pb-20 sm:pt-24',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="animate-aurora absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="animate-aurora absolute -top-20 right-[-15%] h-[420px] w-[420px] rounded-full bg-chart-2/10 blur-3xl"
          style={{ animationDelay: '-9s' }}
        />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div
          className={cn(
            'mx-auto',
            widthClass[width],
            isCenter ? 'text-center' : 'text-left',
          )}
        >
          {eyebrow && (
            <div
              className={cn(
                'animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur',
                !isCenter && 'ml-0',
              )}
            >
              {eyebrow}
            </div>
          )}

          <h1
            className={cn(
              'animate-fade-up text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
              eyebrow && 'reveal-delay-1 mt-5',
            )}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={cn(
                'animate-fade-up reveal-delay-2 mx-auto mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg',
                isCenter ? 'max-w-2xl' : 'max-w-none',
              )}
            >
              {subtitle}
            </p>
          )}

          {meta && (
            <p className="animate-fade-up reveal-delay-2 mt-3 text-sm text-muted-foreground">
              {meta}
            </p>
          )}

          {children && (
            <div className="animate-fade-up reveal-delay-3 mt-8">{children}</div>
          )}
        </div>
      </div>
    </section>
  )
}
