import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request) {
        if (event.request.cookies) {
          event.request.cookies = '[REDACTED]' as unknown as Record<
            string,
            string
          >
        }
        if (event.request.headers) {
          const headers = event.request.headers as Record<string, string>
          if (headers.authorization) headers.authorization = '[REDACTED]'
          if (headers.cookie) headers.cookie = '[REDACTED]'
        }
        if (event.request.data && typeof event.request.data === 'object') {
          const data = event.request.data as Record<string, unknown>
          for (const k of ['password', 'newPassword', 'token', 'secret']) {
            if (k in data) data[k] = '[REDACTED]'
          }
        }
      }
      return event
    },
  })
}
