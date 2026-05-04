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
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aduvanta.com'

const DEFAULT_TITLE = 'Aduvanta — Software Aduanal para Mexico'
const DEFAULT_DESCRIPTION =
  'Software aduanal 100% web para agencias aduanales en Mexico. Pedimentos, clasificacion arancelaria TIGIE, Anexo 22, portal de clientes, facturacion y auditoria en una sola plataforma.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Aduvanta',
  },
  description: DEFAULT_DESCRIPTION,
  formatDetection: { telephone: false },
  icons: {
    icon: [
      {
        url: '/brand/aduvanta-light.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/brand/aduvanta-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    shortcut: '/brand/aduvanta-light.png',
    apple: '/brand/aduvanta-light.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Aduvanta',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [`${BASE_URL}/og-image.png`],
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
