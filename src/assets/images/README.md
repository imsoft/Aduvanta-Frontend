# `src/assets/images/`

Imágenes **importadas** (parte del bundle) que usan `next/image` con dimensiones y
`blurDataURL` inferidos automáticamente.

Úsalo para:

- Mockups del hero y las sections del landing.
- Capturas de producto que cambian con el código.
- Cualquier imagen crítica de UI que quieras versionar con el bundle.

Ejemplo:

```tsx
import Image from 'next/image'
import dashboard from '@/assets/images/hero/dashboard.png'

<Image src={dashboard} alt="Dashboard" placeholder="blur" priority />
```

Para assets de marca, blog, favicons, OG estáticos o SVGs con URL pública,
usa `public/` (ver `public/images/README.md`).
