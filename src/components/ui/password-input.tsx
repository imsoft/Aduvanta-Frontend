'use client'

import * as React from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Input } from './input'
import { Button } from './button'

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'> & {
  ariaLabelShow?: string
  ariaLabelHide?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ariaLabelShow = 'Mostrar contraseña', ariaLabelHide = 'Ocultar contraseña', ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleToggle = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-9', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-2.5 hover:bg-transparent"
        onClick={handleToggle}
        aria-label={showPassword ? ariaLabelHide : ariaLabelShow}
      >
        {showPassword ? (
          <EyeSlash size={16} className="text-muted-foreground" />
        ) : (
          <Eye size={16} className="text-muted-foreground" />
        )}
      </Button>
    </div>
  )
  }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
