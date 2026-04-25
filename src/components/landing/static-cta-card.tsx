import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/reveal'

interface StaticCtaCardProps {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  /** Variante visual: 'muted' (default, fondo suave) o 'primary' (primary). */
  tone?: 'muted' | 'primary'
}

/**
 * Tarjeta de CTA reutilizable para páginas estáticas. Entra con `scale-in`
 * cuando se hace visible y añade auroras animadas sutiles al fondo.
 */
export function StaticCtaCard({
  title,
  description,
  children,
  className,
  tone = 'muted',
}: StaticCtaCardProps) {
  const isPrimary = tone === 'primary'
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <Reveal
        variant="scale"
        className={cn(
          'relative overflow-hidden rounded-3xl p-10 text-center shadow-xl sm:p-14',
          isPrimary
            ? 'bg-primary text-primary-foreground shadow-primary/20'
            : 'bg-muted/50 shadow-primary/5',
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className={cn(
              'animate-aurora absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl',
              isPrimary ? 'bg-white/10' : 'bg-primary/10',
            )}
          />
          <div
            className={cn(
              'animate-aurora absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl',
              isPrimary ? 'bg-chart-2/20' : 'bg-chart-2/10',
            )}
            style={{ animationDelay: '-10s' }}
          />
        </div>

        <div className="relative">
          <h2
            className={cn(
              'text-2xl font-bold tracking-tight sm:text-3xl',
              isPrimary && 'text-primary-foreground',
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                'mx-auto mt-4 max-w-2xl',
                isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground',
              )}
            >
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {children}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
