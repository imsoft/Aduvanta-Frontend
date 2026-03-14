import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en-US', 'es-MX'],
  defaultLocale: 'en-US',
  localePrefix: 'always',
})
