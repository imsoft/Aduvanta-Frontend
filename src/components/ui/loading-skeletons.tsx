import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/* Tabla                                                                      */
/* -------------------------------------------------------------------------- */

interface TableSkeletonProps {
  /** Número de filas de placeholder. */
  rows?: number
  /** Número de columnas (default 5). */
  columns?: number
  /** Renderiza una fila de header arriba. */
  withHeader?: boolean
  className?: string
}

/**
 * Skeleton genérico para tablas de listado. Úsalo mientras `isLoading` de
 * una `useQuery` es `true`. Evita CLS sustancial porque el alto aproximado
 * coincide con el de la tabla real de shadcn.
 */
export function TableSkeleton({
  rows = 8,
  columns = 5,
  withHeader = true,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn('w-full overflow-hidden rounded-md border', className)}
      role="status"
      aria-label="Cargando"
    >
      {withHeader && (
        <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={`h-${i}`}
              className="h-4 flex-1"
              style={{ maxWidth: `${60 + (i % 3) * 20}%` }}
            />
          ))}
        </div>
      )}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={`${r}-${c}`}
                className="h-4 flex-1"
                style={{ maxWidth: `${50 + ((r + c) % 4) * 15}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Grid de cards                                                              */
/* -------------------------------------------------------------------------- */

interface CardsSkeletonProps {
  count?: number
  className?: string
  /** Clases del contenedor grid (responsive cols) */
  gridClassName?: string
}

export function CardsSkeleton({
  count = 6,
  className,
  gridClassName = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
}: CardsSkeletonProps) {
  return (
    <div
      className={cn(gridClassName, className)}
      role="status"
      aria-label="Cargando"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-lg border bg-card p-4"
        >
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="mt-2 flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Lista simple (filas verticales tipo feed/comentarios)                      */
/* -------------------------------------------------------------------------- */

export function ListSkeleton({
  rows = 6,
  className,
}: {
  rows?: number
  className?: string
}) {
  return (
    <div
      className={cn('flex flex-col gap-3', className)}
      role="status"
      aria-label="Cargando"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Formulario                                                                 */
/* -------------------------------------------------------------------------- */

export function FormSkeleton({
  fields = 5,
  className,
}: {
  fields?: number
  className?: string
}) {
  return (
    <div
      className={cn('w-full max-w-2xl space-y-4', className)}
      role="status"
      aria-label="Cargando"
    >
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Header de página (títulos + subtítulos)                                    */
/* -------------------------------------------------------------------------- */

export function PageHeaderSkeleton({
  withAction = false,
  className,
}: {
  withAction?: boolean
  className?: string
}) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4', className)}
      role="status"
      aria-label="Cargando"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {withAction && <Skeleton className="h-9 w-32" />}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Detalle/página completa (header + tabla o cards)                           */
/* -------------------------------------------------------------------------- */

export function DetailPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('w-full space-y-6', className)}
      role="status"
      aria-label="Cargando"
    >
      <PageHeaderSkeleton withAction />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-lg border p-4 md:col-span-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <TableSkeleton rows={5} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Layout completo del dashboard (shell con sidebar + header + main)          */
/* -------------------------------------------------------------------------- */

export function DashboardShellSkeleton() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-background"
      role="status"
      aria-label="Cargando aplicación"
    >
      <aside className="hidden w-60 shrink-0 flex-col gap-3 border-r bg-muted/30 p-4 md:flex">
        <Skeleton className="h-8 w-32" />
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <Skeleton className="h-7 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        </header>
        <main className="flex-1 space-y-6 overflow-auto p-6">
          <PageHeaderSkeleton withAction />
          <TableSkeleton rows={6} />
        </main>
      </div>
    </div>
  )
}
