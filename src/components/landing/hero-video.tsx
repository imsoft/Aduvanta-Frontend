'use client'

import { Play } from '@phosphor-icons/react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type HeroVideoProps = {
  /** Fuentes de video. Orden: WebM primero (navegadores modernos), luego MP4. */
  sources: Array<{ src: string; type: `video/${string}` }>
  /** Texto accesible para el botón de play. */
  playLabel: string
  /** Opcional: ruta al poster (imagen estática antes del play). */
  poster?: string
  /** Texto alternativo del poster (si se proporciona). */
  posterAlt?: string
  /** Texto mostrado debajo del botón de play. */
  caption?: string
  className?: string
}

export function HeroVideo({
  sources,
  playLabel,
  poster,
  posterAlt,
  caption,
  className,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const handlePlay = () => {
    setPlaying(true)
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {
        // Reproducción bloqueada por el navegador — los controles nativos quedan visibles.
      })
    })
  }

  return (
    <div className={cn('group relative', className)}>
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rounded-4xl bg-linear-to-r from-primary/25 via-chart-1/25 to-chart-2/25 opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-90"
      />

      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-linear-to-br from-muted/50 to-muted shadow-2xl',
          !playing && 'animate-float',
        )}
      >
        {playing ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={poster}
          >
            {sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        ) : (
          <>
            {poster ? (
              <Image
                src={poster}
                alt={posterAlt ?? ''}
                fill
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-br from-primary/8 via-chart-1/6 to-chart-2/8"
              />
            )}
            <button
              type="button"
              onClick={handlePlay}
              aria-label={playLabel}
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                poster
                  ? 'bg-background/10 backdrop-blur-[2px] hover:bg-background/20'
                  : 'hover:bg-background/30',
              )}
            >
              <span className="flex flex-col items-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 ring-4 ring-background/70 transition-transform group-hover:scale-110">
                  <Play size={26} weight="fill" className="ml-1" />
                </span>
                {caption ? (
                  <span className="mt-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                    {caption}
                  </span>
                ) : null}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
