import type { Metadata } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Aduvanta',
  description: 'Enterprise customs and foreign trade operations platform',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning dir="ltr" className="scroll-smooth">
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
      </body>
    </html>
  );
}
