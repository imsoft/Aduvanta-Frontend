# Aduvanta — Frontend

Aplicación web en [Next.js](https://nextjs.org/) (App Router) para Aduvanta: landing, marketing, panel (dashboard), portal de clientes y autenticación, consumiendo el API de **aduvanta-backend**.

## Requisitos

- Node.js compatible con Next.js 16
- [pnpm](https://pnpm.io/)

## Stack principal

| Área | Tecnología |
|------|------------|
| Framework | Next.js 16, React 19 |
| Estilos | Tailwind CSS 4 |
| UI | Radix UI, patrones [shadcn/ui](https://ui.shadcn.com/) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) — rutas bajo `src/app/[locale]` (`en-US`, `es-MX`) |
| Datos | TanStack Query, axios |
| Auth cliente | [better-auth](https://www.better-auth.com/) (`auth-client`) |
| Formularios | react-hook-form, Zod |
| Tema | next-themes |
| Estado | Zustand |
| Observabilidad | Sentry (`@sentry/nextjs`), Vercel Analytics y Speed Insights |
| Compilador | React Compiler (`babel-plugin-react-compiler` en `next.config.ts`) |

## Configuración local

1. Instalar dependencias:

```bash
pnpm install
```

2. Variables de entorno:

```bash
cp .env.local.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL base del backend **sin** path `/api` extra al final. Debe coincidir con `BETTER_AUTH_URL` del API. Ej.: `http://localhost:3000` en local, `https://api.tu-dominio.com` en producción |
| `NEXT_PUBLIC_APP_URL` | URL pública del sitio (SEO, sitemap, Open Graph). Ej.: `https://aduvanta.com` |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | `true` para mostrar “Entrar con Google” (requiere OAuth configurado en el backend) |

3. Arrancar en desarrollo:

```bash
pnpm dev
```

Por defecto Next usa el puerto **3000**. El backend de Aduvanta suele usar también el **3000** en local, así que levanta el frontend en otro puerto y alinea CORS en el API:

```bash
pnpm dev -- -p 3001
```

En el backend, `CORS_ORIGIN` debe ser `http://localhost:3001` (o la lista separada por comas que corresponda).

Abre `http://localhost:3001` (o el puerto que elijas).

## Scripts

```bash
pnpm dev      # Servidor de desarrollo
pnpm build    # Compilación de producción
pnpm start    # Servidor Node tras build
pnpm lint     # ESLint
```

## Estructura (resumen)

- `src/app/` — rutas App Router; i18n con `[locale]`
- `src/i18n/` — configuración next-intl
- `src/components/` — UI compartida y secciones de landing
- `src/lib/` — cliente API, auth, SEO, utilidades

## Despliegue (p. ej. Vercel)

- `NEXT_PUBLIC_API_URL` = URL HTTPS del API en producción (mismo host que usa Better Auth en el servidor).
- `NEXT_PUBLIC_APP_URL` = dominio del frontend (`https://aduvanta.com`, etc.).
- Tras cambiar variables de entorno, redeploy del proyecto.

## Documentación adicional

- [Next.js](https://nextjs.org/docs)
- [next-intl](https://next-intl-docs.vercel.app/docs/getting-started/app-router)
- [Better Auth](https://www.better-auth.com/docs)

## Licencia

Privado (ver `package.json`).
