# Guía para actualizar el frontend (Next.js)

Este documento describe cómo mantener actualizadas las dependencias del frontend de Aduvanta (Next.js 16 + React 19 + `pnpm`).

## 1. Ver qué hay desactualizado

```bash
pnpm outdated
```

Te muestra una tabla con:
- **Current**: versión instalada.
- **Wanted**: última versión compatible con el rango de `package.json`.
- **Latest**: última disponible (puede ser una major distinta).

## 2. Actualización segura (respeta rangos semver)

```bash
pnpm update
```

Sube las dependencias a la última versión compatible con los rangos definidos en `package.json`. Opción recomendada para mantenimiento rutinario.

Variantes útiles:

```bash
pnpm update --latest                 # sube a la última absoluta (puede romper)
pnpm update --interactive            # menú interactivo
pnpm update next react react-dom     # dependencias específicas
```

## 3. Actualizar Next.js con su CLI oficial (recomendado)

Next.js trae un comando dedicado que actualiza `next`, `react`, `react-dom`, `eslint-config-next` y aplica **codemods** automáticos (renombres de APIs, cambios de imports, etc.):

```bash
pnpm dlx @next/codemod@canary upgrade latest
```

Opciones:

```bash
pnpm dlx @next/codemod@canary upgrade rc       # release candidate
pnpm dlx @next/codemod@canary upgrade canary   # canal canary
```

Úsalo siempre que saltes una major (ej. 15 → 16).

## 4. Grupos de dependencias a actualizar juntas

Para evitar incompatibilidades entre paquetes del mismo ecosistema, actualízalos en bloque:

```bash
pnpm update "@tanstack/*"                                    # react-query, react-table
pnpm update "@sentry/*"
pnpm update "@vercel/*"
pnpm update tailwindcss @tailwindcss/postcss tw-animate-css
pnpm update "@hookform/*" react-hook-form
pnpm update "radix-ui"
```

## 5. Flujo recomendado paso a paso

```bash
# 1. Rama aparte
git checkout -b chore/update-deps

# 2. Revisa el estado
pnpm outdated

# 3. Minor + patch seguro
pnpm update

# 4. Next/React coherente + codemods
pnpm dlx @next/codemod@canary upgrade latest

# 5. Asegura el lockfile
pnpm install

# 6. Lint + build
pnpm run lint
pnpm run build

# 7. Prueba en local
pnpm dev
```

## 6. Volver atrás si algo falla

```bash
git restore package.json pnpm-lock.yaml
pnpm install
```

## 7. Monorepo (`pnpm-workspace.yaml`)

Como este proyecto usa un workspace de `pnpm`, si en el futuro añades más apps o paquetes internos puedes actualizar todo a la vez:

```bash
pnpm -r outdated     # estado de todo el monorepo
pnpm -r update       # actualiza todos los paquetes del workspace
```

## 8. Buenas prácticas

- Actualiza en una rama dedicada (`chore/update-deps`) y abre un PR.
- Revisa los *changelogs* de `next`, `react`, `@tanstack/react-query`, `tailwindcss`, `better-auth` y `next-intl` antes de una major.
- Corre `pnpm run build` siempre antes de mergear (detecta errores de tipos y de RSC).
- Si los codemods modifican archivos, revisa el diff antes de commitear.
- Verifica manualmente las rutas críticas (auth, checkout, i18n) tras una actualización major.
