import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  size?: number
  className?: string
}

export function Logo({ size = 36, className }: Props) {
  const pixelSize = `${size}px`

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/aduvanta-light.png"
        alt=""
        width={size}
        height={size}
        className="object-contain dark:hidden"
        sizes={pixelSize}
        priority
        aria-hidden
      />
      <Image
        src="/brand/aduvanta-dark.png"
        alt=""
        width={size}
        height={size}
        className="hidden object-contain dark:block"
        sizes={pixelSize}
        priority
        aria-hidden
      />
    </span>
  )
}
