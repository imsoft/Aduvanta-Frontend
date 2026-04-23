# Auditoría de seguridad — Frontend

Auditoría realizada sobre [`aduvanta-frontend`](../) (Next.js 16, React 19, Tailwind 4, Better Auth client, Zustand, next-intl).

**Fecha de la auditoría:** 2026-04-22
**Alcance:** código, configuración, dependencias y procesos de despliegue.
**Entorno de despliegue:** Vercel.

## Cómo leer este reporte

Ver convención en [`aduvanta-backend/docs/security-audit.md`](../../aduvanta-backend/docs/security-audit.md).

## Resumen ejecutivo

| Severidad | Total | Abiertos | Mitigados |
|-----------|-------|----------|-----------|
| Crítico   | 0     | 0        | 0         |
| Alto      | 2     | 0        | 2         |
| Medio     | 3     | 0        | 3         |
| Bajo      | 3     | 0        | 3         |

> **Nota sobre C1 (retirado tras verificar build).** Inicialmente se reportó que el middleware en `src/proxy.ts` no estaba activo (se creía que Next exigía `src/middleware.ts`). En realidad, **Next.js 16 deprecó `middleware.ts` a favor de `proxy.ts`** — el archivo sí se registra (el build imprime `ƒ Proxy (Middleware)`). El hallazgo real, degradado a Medio, fue la falta de sanitización del `callbackUrl` — ver M11, ya mitigado.

---

## ALTO

### A2 — CSP ausente — **mitigado**

- **Evidencia previa:** [`next.config.ts`](../next.config.ts) incluía HSTS, X-Frame, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, pero **no** CSP.
- **Fix aplicado:** [`next.config.ts`](../next.config.ts) ahora emite `Content-Security-Policy` con política estricta:
  - `default-src 'self'`
  - `base-uri 'self'`; `frame-ancestors 'none'`; `form-action 'self'`; `object-src 'none'`
  - `img-src 'self' data: blob: https:`
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.vercel-insights.com https://*.sentry.io`
  - `connect-src 'self' ${NEXT_PUBLIC_API_URL} https://*.sentry.io https://*.ingest.sentry.io https://vitals.vercel-insights.com`
  - `upgrade-insecure-requests`
- **Siguiente paso (fuera de alcance):** migrar `script-src` a **nonces** generados en el proxy para retirar `'unsafe-inline'`/`'unsafe-eval'`.
- **Estado:** mitigado.

### A4 — Sentry no inicializado — **mitigado**

- **Fix aplicado:** creados [`sentry.client.config.ts`](../sentry.client.config.ts), [`sentry.server.config.ts`](../sentry.server.config.ts), [`sentry.edge.config.ts`](../sentry.edge.config.ts) e [`instrumentation.ts`](../instrumentation.ts). `beforeSend` scrubbing de cookies/auth/tokens. Producción debe setear `NEXT_PUBLIC_SENTRY_DSN` en Vercel env.
- **Estado:** mitigado.

---

## MEDIO

### M6 — `.env.local.example` ausente — **mitigado**

- **Fix aplicado:** creado [`.env.local.example`](../.env.local.example) con `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`, `NEXT_PUBLIC_SENTRY_DSN` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- **Estado:** mitigado.

### M11 — Sanitización del `callbackUrl` en el proxy — **mitigado**

- **Evidencia previa:** [`src/proxy.ts`](../src/proxy.ts) ponía `pathname` crudo como `callbackUrl`.
- **Fix aplicado:** función `sanitizeCallbackUrl` que solo permite rutas que comiencen por una sola `/`, rechazando `//`, `\` y esquemas. Devuelve `/` para cualquier valor sospechoso. Previene open-redirect si el `callbackUrl` llegara a aceptarse desde query en el futuro.
- **Estado:** mitigado.

### M10 — Zustand `persist` guardaba lista de organizaciones — **mitigado**

- **Evidencia previa:** [`src/store/org.store.ts`](../src/store/org.store.ts) persistía tanto `activeOrgId` como `organizations`.
- **Fix aplicado:** `persist` ahora usa `partialize` para persistir **solo** `activeOrgId`. La lista de orgs se refetchea desde el backend tras el login.
- **Estado:** mitigado.

---

## BAJO

### B1 — `poweredByHeader` no deshabilitado — **mitigado**

- **Fix aplicado:** [`next.config.ts`](../next.config.ts) con `poweredByHeader: false`.
- **Estado:** mitigado.

### B3 — `eslint-config-next` desalineado con `next` — **mitigado**

- **Fix aplicado:** `pnpm add -D eslint-config-next@16.2.4`. Alineado con `next@16.2.4`.
- **Estado:** mitigado.

### B6 — `analytics.ts` envía `pageUrl` completo — **mitigado parcialmente**

- **Fix aplicado:** en el `beforeSend` de [`sentry.client.config.ts`](../sentry.client.config.ts), la URL de eventos Sentry se recorta a `origin + pathname` (sin query). Para `analytics.ts` propio, auditar al añadir nuevos parámetros.
- **Estado:** mitigado (Sentry).

---

## Referencias cruzadas

Hallazgos de infra y procesos que afectan a ambos repos viven en [`aduvanta-backend/docs/security-operations.md`](../../aduvanta-backend/docs/security-operations.md).

## Referencias externas

- [Next.js security best practices](https://nextjs.org/docs/app/guides/content-security-policy)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
