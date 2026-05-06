"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, SpinnerIcon } from "@phosphor-icons/react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4 text-green-600" />,
        info: <InfoIcon className="size-4 text-blue-600" />,
        warning: <WarningIcon className="size-4 text-amber-600" />,
        error: <XCircleIcon className="size-4 text-red-600" />,
        loading: <SpinnerIcon className="size-4 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "#f0fdf4",
          "--success-text": "#15803d",
          "--success-border": "#bbf7d0",
          "--error-bg": "#fef2f2",
          "--error-text": "#b91c1c",
          "--error-border": "#fecaca",
          "--warning-bg": "#fffbeb",
          "--warning-text": "#b45309",
          "--warning-border": "#fde68a",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
