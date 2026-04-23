import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const publicPaths = ['/', '/sign-in', '/sign-up']

function isPublicPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(en-US|es-MX)/, '') || '/'
  return publicPaths.some(
    (p) => withoutLocale === p || withoutLocale.startsWith(`${p}/`),
  )
}

function sanitizeCallbackUrl(raw: string): string {
  // Solo aceptar rutas relativas internas. Evita open redirect a sitios
  // externos o esquemas peligrosos (javascript:, data:, //evil.com, etc.).
  if (!raw.startsWith('/')) return '/'
  if (raw.startsWith('//')) return '/'
  if (raw.includes('\\')) return '/'
  return raw
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const intlResponse = intlMiddleware(request)

  if (isPublicPath(pathname)) {
    return intlResponse
  }

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ??
    request.cookies.get('__Secure-better-auth.session_token')

  if (!sessionCookie) {
    const locale =
      pathname.match(/^\/(en-US|es-MX)/)?.[1] ?? routing.defaultLocale
    const signInUrl = new URL(`/${locale}/sign-in`, request.url)
    signInUrl.searchParams.set('callbackUrl', sanitizeCallbackUrl(pathname))
    return NextResponse.redirect(signInUrl)
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
}
