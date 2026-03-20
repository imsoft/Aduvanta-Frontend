# Aduvanta — Frontend

Aplicación web en [Next.js](https://nextjs.org/) (App Router) para la plataforma Aduvanta: panel, portal y flujos de autenticación, integrada con el API de `aduvanta-backend`.

## Requisitos

- Node.js compatible con Next.js 16
- [pnpm](https://pnpm.io/)

## Stack principal

| Área | Tecnología |
|------|------------|
| Framework | Next.js 16, React 19 |
| Estilos | Tailwind CSS 4 |
| UI | Radix UI, patrones [shadcn/ui](https://ui.shadcn.com/) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) (rutas bajo `src/app/[locale]`) |
| Datos / servidor | TanStack Query, axios |
| Formularios | react-hook-form, Zod |
| Tema | next-themes |
| Estado | Zustand |
| Observabilidad | Sentry (`@sentry/nextjs`) |
| Compilador | React Compiler (`babel-plugin-react-compiler` en `next.config.ts`) |

## Configuración

1. Instalar dependencias:

```bash
pnpm install
```

2. Variables de entorno:

```bash
cp .env.local.example .env.local
```

- `NEXT_PUBLIC_API_URL` — URL base del backend (p. ej. `http://localhost:3000`). Debe coincidir con `BETTER_AUTH_URL` y CORS del API.

3. Arrancar en desarrollo:

```bash
pnpm dev
```

Por defecto Next.js usa el puerto **3000**. Si el backend también está en 3000, configura otro puerto para el frontend, por ejemplo:

```bash
pnpm dev -- -p 3001
```

y alinea `CORS_ORIGIN` en el backend con `http://localhost:3001`.

Abre [http://localhost:3000](http://localhost:3000) (o el puerto que elijas) en el navegador.

## Scripts

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Compilación de producción
pnpm start        # Servidor tras build
pnpm lint         # ESLint
```

## Estructura (resumen)

- `src/app/` — rutas App Router; internacionalización con segmento `[locale]`
- `src/i18n/` — configuración next-intl
- Componentes y utilidades según la organización actual del repositorio

## Documentación adicional

- [Next.js](https://nextjs.org/docs)
- [next-intl](https://next-intl-docs.vercel.app/docs/getting-started/app-router)

## Licencia

Privado (ver `package.json`).
