# Guía de imágenes — Aduvanta Frontend

Esta es la convención que seguimos para organizar imágenes en el proyecto. Respétala
para mantener consistencia y para que Next.js 16 optimice las imágenes de forma
automática.

---

## 1. ¿Dónde guardo una imagen?

Tenemos **dos ubicaciones**, cada una con un propósito claro.

### `public/` — Assets servidos directamente (sin procesar)

Úsalo cuando:

- La imagen se referencia por URL fija (`/images/landing/hero/dashboard.png`).
- Necesitas que el archivo sea accesible por URL pública (p. ej. OG image, favicon).
- La imagen puede cambiar entre despliegues sin requerir rebuild.
- Es un `.svg` que usarás como `<Image src="/..."/>` o con `<img>`.

Ejemplo:

```tsx
import Image from 'next/image'

<Image
  src="/images/landing/hero/dashboard.png"
  alt="Dashboard de Aduvanta"
  width={1280}
  height={720}
  priority
/>
```

> Importante: cuando referencias desde `public/` debes **pasar `width` y `height` a
> mano** porque Next.js no puede inferirlos.

### `src/assets/images/` — Imágenes importadas (recomendado para la landing)

Úsalo cuando:

- La imagen es parte del bundle de la app (mockups del hero, features, etc.).
- Quieres que Next.js **infiera dimensiones y genere `blurDataURL` automático**.
- La imagen cambia junto con el código (sube/baja con el commit).

Ejemplo:

```tsx
import Image from 'next/image'
import dashboardImg from '@/assets/images/hero/dashboard.png'

<Image
  src={dashboardImg}
  alt="Dashboard de Aduvanta"
  placeholder="blur"
  priority
/>
```

> Ventajas: no necesitas escribir `width`/`height`, obtienes `blur placeholder`
> gratis, y si cambias la imagen el hash del bundle se actualiza (mejor cache-busting).

**Regla rápida:** para imágenes críticas de UI (mockups, features, testimonial
avatars) usa `src/assets/images/`. Para assets de marca, favicons, OG, SEO o
contenido editorial (blog) usa `public/`.

---

## 2. Estructura de carpetas

### `public/`

```
public/
├── brand/                  ← Logos, isotipos, wordmarks oficiales
│   ├── logo.svg
│   ├── logo-dark.svg
│   ├── logo-mark.svg       ← Isotipo (sin texto)
│   └── logo-wordmark.svg   ← Solo texto
│
├── images/
│   ├── landing/            ← Exclusivo para marketing pages
│   │   ├── hero/           ← Mockups del hero principal
│   │   ├── features/       ← Capturas por feature (pedimentos, TIGIE, etc.)
│   │   ├── how-it-works/   ← Ilustraciones del paso-a-paso
│   │   ├── testimonials/   ← Avatares de clientes
│   │   └── logos-clients/  ← Logos de agencias aduanales clientes
│   │
│   ├── blog/               ← Cover images por post (subcarpeta por slug)
│   │   └── <slug>/
│   │       └── cover.jpg
│   │
│   ├── product/            ← Screenshots reutilizables del producto real
│   │
│   └── og/                 ← Imágenes OG estáticas por página (si no se generan dinámicas)
│
└── (favicons y SVGs sueltos en la raíz, como ya existen: file.svg, globe.svg, etc.)
```

### `src/assets/images/`

Puedes replicar una estructura similar pero **sin la capa `images/`**:

```
src/assets/images/
├── hero/
│   └── dashboard.png
├── features/
│   ├── pedimentos.png
│   ├── tigie.png
│   └── portal-clientes.png
└── testimonials/
    └── cliente-01.jpg
```

---

## 3. Convención de nombrado

- **kebab-case** siempre: `dashboard-preview.png`, no `DashboardPreview.png`.
- Sin espacios ni caracteres acentuados.
- Nombre **descriptivo** del contenido, no del contexto. Usa `dashboard-pedimentos.png`,
  no `feature-1.png`.
- Para variantes de tema, sufija: `logo.svg`, `logo-dark.svg`.
- Para tamaños explícitos, sufija: `hero-mobile.png`, `hero-desktop.png`.

---

## 4. Formatos recomendados

| Uso | Formato | Notas |
|---|---|---|
| Logos, iconos, ilustraciones planas | **SVG** | Escalables y ligeros |
| Mockups de producto, fotografía | **WebP** (preferido) o **AVIF** | ~30–50% menor que PNG/JPG |
| Fotos con transparencia | **PNG** | Si WebP no es opción |
| Avatares pequeños | **WebP** o **JPG** | |
| OG images estáticas | **PNG** 1200×630 | Obligatorio para redes sociales |
| Favicon / app icon | Generado vía `src/app/icon.tsx` | No ponerlo en `public/` |

> Next 16 ya convierte PNG/JPG a AVIF/WebP automáticamente en `/public`, pero si subes
> directo WebP ahorras ancho de banda y tiempo de build.

---

## 5. Dimensiones recomendadas (para que no se vean pixeladas)

| Uso | Dimensión mínima | Aspect ratio |
|---|---|---|
| Hero mockup | 2560×1440 (2x) | 16:9 |
| Feature screenshot | 1920×1080 | 16:9 |
| Avatar testimonio | 256×256 | 1:1 |
| Logo cliente | 400×120 | libre, altura fija |
| OG image | 1200×630 | 1.91:1 |
| Blog cover | 1600×900 | 16:9 |

Sube al menos **2×** del tamaño que se renderizará para pantallas retina.

---

## 6. Checklist antes de hacer commit

- [ ] La imagen está en **la carpeta correcta** (`public/` vs `src/assets/`).
- [ ] El nombre es `kebab-case` y descriptivo.
- [ ] El formato es WebP/AVIF si es fotografía/mockup, SVG si es vectorial.
- [ ] Peso < 300 KB en la mayoría de los casos (< 1 MB para hero en alta resolución).
- [ ] Optimizada (pasa por https://squoosh.app o similar antes de subirla).
- [ ] Se usa con `next/image` y tiene `alt` descriptivo (nunca vacío salvo que sea decorativa).
- [ ] Si es `priority` (above-the-fold), añade el prop `priority`.

---

## 7. Alt text

- **Obligatorio** salvo que la imagen sea **puramente decorativa** (en ese caso
  `alt=""`).
- Describe el contenido, no el archivo: `alt="Dashboard de Aduvanta mostrando un
  pedimento en validación"`, no `alt="dashboard.png"`.
- Evita frases como "imagen de" o "foto de".

---

## 8. Íconos y favicon: NO van aquí

Usamos las convenciones de Next.js App Router:

- Favicon → `src/app/favicon.ico` (o `src/app/icon.tsx`)
- Apple icon → `src/app/apple-icon.tsx`
- OG dinámico → `src/app/opengraph-image.tsx` (ya existente)
- OG por ruta → `src/app/<ruta>/opengraph-image.tsx`

Iconos de UI (flechas, check, etc.) se importan desde `@phosphor-icons/react`, no
como archivos.
