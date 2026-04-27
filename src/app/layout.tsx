import type { Metadata } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Aduvanta — Software Aduanal para Mexico',
    template: '%s | Aduvanta',
  },
  description:
    'Software aduanal 100% web para agencias aduanales en Mexico. Pedimentos, clasificacion arancelaria TIGIE, Anexo 22, portal de clientes, facturacion y auditoria en una sola plataforma.',
  icons: {
    icon: '/brand/aduvanta-logo.svg',
    shortcut: '/brand/aduvanta-logo.svg',
    apple: '/brand/aduvanta-logo.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning dir="ltr" className="scroll-smooth">
      <body
        className={cn(
          'antialiased',
          geistSans.variable,
          jetbrainsMono.variable,
        )}
      >
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
