# Aduvanta — Frontend

Aplicación web en [Next.js](https://nextjs.org/) (App Router) para la plataforma Aduvanta: landing, panel de operaciones (dashboard), portal de clientes y autenticación.

Consume la API de **aduvanta-backend** (`NEXT_PUBLIC_API_URL`).

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | Compatible con Next.js 16 (≥ 20) |
| pnpm | ≥ 9 |

## Stack

| Área | Tecnología |
|---|---|
| Framework | Next.js 16.2 + React 19 (App Router) |
| Estilos | Tailwind CSS 4 |
| Componentes UI | Radix UI (via `radix-ui`) + patrones [shadcn/ui](https://ui.shadcn.com/) |
| Iconos | [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) — `es-MX` y `en-US` |
| Fetching de datos | TanStack Query 5 + axios |
| Tablas | TanStack Table 8 |
| Autenticación cliente | [Better Auth](https://www.better-auth.com/) 1.6 |
| Formularios | React Hook Form 7 + Zod 4 |
| Tema | next-themes (claro / oscuro / sistema) |
| Estado global | Zustand 5 |
| Notificaciones | Sonner |
| Fechas | date-fns 4 |
| Observabilidad | Sentry + Vercel Analytics + Speed Insights |
| Compilador | React Compiler (`babel-plugin-react-compiler`) |

---

## Configuración local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend **sin** `/api` al final. Ej: `http://localhost:3000` en local, `https://api.aduvanta.com` en producción |
| `NEXT_PUBLIC_APP_URL` | URL pública del sitio (SEO, sitemap, Open Graph). Ej: `https://aduvanta.com` |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | `true` para mostrar "Entrar con Google" (requiere OAuth configurado en el backend) |

### 3. Iniciar en desarrollo

Por defecto Next.js usa el puerto 3000. Como el backend también usa el 3000, arranca el frontend en otro:

```bash
pnpm dev -- -p 3001
```

Abre `http://localhost:3001`.

En el backend, `CORS_ORIGIN` debe incluir `http://localhost:3001`.

---

## Scripts

```bash
pnpm dev      # Servidor de desarrollo (Turbopack)
pnpm build    # Build de producción
pnpm start    # Arrancar build de producción
pnpm lint     # ESLint
```

---

## Estructura

```
src/
├── app/
│   └── [locale]/
│       ├── (auth)/          # Rutas de autenticación (sign-in, sign-up)
│       ├── (dashboard)/     # Panel de operaciones (requiere sesión)
│       │   └── dashboard/   # Páginas del dashboard
│       ├── (landing)/       # Landing, marketing y páginas públicas
│       └── (portal)/        # Portal de clientes externos
├── components/
│   ├── layout/              # AppHeader, AppSidebar, OrgSwitcher
│   └── ui/                  # Componentes shadcn/ui (Button, Input, Select, etc.)
├── features/                # Lógica de cada feature: api/ + hooks/
├── i18n/                    # Configuración next-intl (routing, navigation)
├── lib/                     # api-client, auth-client, utils, SEO helpers
├── providers/               # ThemeProvider, QueryProvider
└── store/                   # Zustand stores (org.store, etc.)
messages/
├── es-MX.json               # Traducciones en español (México)
└── en-US.json               # Traducciones en inglés (EE. UU.)
```

---

## Páginas del dashboard

| Ruta | Descripción |
|---|---|
| `/dashboard` | Panel principal con KPIs operacionales en tiempo real |
| `/dashboard/operations` | Operaciones aduaneras y expedientes |
| `/dashboard/clients` | Directorio de clientes |
| `/dashboard/pedimentos` | Pedimentos de importación/exportación |
| `/dashboard/clasificacion` | Clasificación arancelaria TIGIE |
| `/dashboard/inspecciones` | Reconocimientos aduaneros y semáforo |
| `/dashboard/previos` | Previos de mercancía |
| `/dashboard/bodega` | Inventario de almacén y movimientos |
| `/dashboard/tesoreria` | Tesorería y cuenta corriente de clientes |
| `/dashboard/padron` | Padrón de importadores e IMMEX |
| `/dashboard/reportes` | Reportes operacionales y balanza de mercancías |
| `/dashboard/conversiones` | Conversor universal de unidades + tipos de cambio (FIX SAT y mercado) |
| `/dashboard/ai` | Copiloto IA |
| `/dashboard/integrations` | Integraciones con sistemas externos |
| `/dashboard/compliance/rule-sets` | Motor de cumplimiento documental |
| `/dashboard/audit-logs` | Registros de auditoría |
| `/dashboard/users` | Gestión de usuarios |
| `/dashboard/roles` | Roles y permisos |
| `/dashboard/organizations` | Organizaciones (multi-tenant) |
| `/dashboard/billing` | Facturación y suscripción |
| `/dashboard/settings` | Configuración: perfil, tema, idioma y sesión |

---

## Internacionalización

Las rutas incluyen el prefijo de locale: `/es-MX/dashboard`, `/en-US/dashboard`.

Los archivos de traducción están en `messages/`:
- `es-MX.json` — Español México (idioma principal)
- `en-US.json` — English US

El cambio de idioma se hace desde **Configuración → Idioma** (`/dashboard/settings`).

---

## Despliegue en producción (Vercel)

- `NEXT_PUBLIC_API_URL` = URL HTTPS del backend (`https://api.aduvanta.com`)
- `NEXT_PUBLIC_APP_URL` = dominio canónico del frontend (`https://aduvanta.com`)
- Tras cualquier cambio de variables de entorno, redeploy del proyecto

---

## Documentación adicional

- [Actualizar dependencias](./docs/updating.md)
- [Next.js](https://nextjs.org/docs)
- [next-intl](https://next-intl-docs.vercel.app/docs/getting-started/app-router)
- [Better Auth](https://www.better-auth.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)

## Licencia

Privado — `UNLICENSED`.
