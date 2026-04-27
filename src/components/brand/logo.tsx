import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  size?: number;
  className?: string;
};

export function Logo({ size = 36, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/aduvanta-logo.svg"
        alt="Aduvanta"
        width={size}
        height={size}
        priority
      />
    </span>
  );
}
