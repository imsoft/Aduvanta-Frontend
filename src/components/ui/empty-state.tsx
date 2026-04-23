import { type ReactNode } from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * Wrapper alrededor del primitivo `<Empty>` de shadcn/ui que conserva la API
 * original de la app (`title`, `description`, `icon`, `action`) para que las
 * páginas existentes migren sin cambios. Si necesitas más control (slots
 * personalizados, variantes), compón directamente con `<Empty>` y sus
 * subcomponentes.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  )
}
