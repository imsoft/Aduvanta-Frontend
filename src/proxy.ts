import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const publicPaths = ['/', '/sign-in', '/sign-up']

// Paths where an authenticated user should be bounced to the dashboard
// instead of seeing the public page (landing, sign-in, sign-up).
const redirectToDashboardPaths = ['/', '/sign-in', '/sign-up']

// Built from routing.locales so adding a new locale automatically updates
// the middleware — no hardcoded regex to forget.
const localeSegment = routing.locales.join('|')
const localePrefix = new RegExp(`^/(${localeSegment})`)

function stripLocale(pathname: string): string {
  return pathname.replace(localePrefix, '') || '/'
}

function isPublicPath(pathname: string): boolean {
  const withoutLocale = stripLocale(pathname)
  return publicPaths.some(
    (p) => withoutLocale === p || withoutLocale.startsWith(`${p}/`),
  )
}

function isRedirectToDashboardPath(pathname: string): boolean {
  const withoutLocale = stripLocale(pathname)
  return redirectToDashboardPaths.some(
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
    if (isRedirectToDashboardPath(pathname)) {
      const sessionCookie =
        request.cookies.get('better-auth.session_token') ??
        request.cookies.get('__Secure-better-auth.session_token')

      if (sessionCookie) {
        const locale =
          pathname.match(/^\/(en-US|es-MX)/)?.[1] ?? routing.defaultLocale
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard`, request.url),
        )
      }
    }

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
