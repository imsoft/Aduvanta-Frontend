import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const publicPaths = [
  '/',
  '/sign-in',
  '/sign-up',
]

function isPublicPath(pathname: string): boolean {
  // Strip locale prefix (e.g. /en-US/sign-in -> /sign-in)
  const withoutLocale = pathname.replace(/^\/(en-US|es-MX)/, '') || '/'
  return publicPaths.some(
    (p) => withoutLocale === p || withoutLocale.startsWith(`${p}/`),
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always run intl middleware first
  const intlResponse = intlMiddleware(request)

  // Skip auth check for public paths and static files
  if (isPublicPath(pathname)) {
    return intlResponse
  }

  // Check for Better Auth session cookie
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ??
    request.cookies.get('__Secure-better-auth.session_token')

  if (!sessionCookie) {
    const locale = pathname.match(/^\/(en-US|es-MX)/)?.[1] ?? routing.defaultLocale
    const signInUrl = new URL(`/${locale}/sign-in`, request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
}
