# `public/videos/`

Archivos de video servidos directamente por Next.js sin procesamiento.

## Estructura

```text
public/videos/
└── landing/
    ├── demo.mp4        Demo de producto (MP4 / H.264 / AAC)
    ├── demo.webm       Mismo demo en WebM (VP9 / Opus) — opcional pero recomendado
    └── demo-poster.jpg Frame de poster para antes de reproducir
```

## Convenciones

| Campo        | Recomendación                                                                         |
| ------------ | ------------------------------------------------------------------------------------- |
| Nombre       | `kebab-case`, sin acentos, sin espacios                                               |
| Resolución   | 1920×1080 máx (1280×720 suficiente para landing)                                      |
| Aspect ratio | `16:9` para encajar con `aspect-video`                                                |
| Duración     | 60–120 s para demos; evita videos largos sin capítulos                                |
| Formato      | MP4 (`H.264 + AAC`) como fallback universal; WebM (`VP9 + Opus`) para navegadores modernos |
| Peso         | Ideal < 10 MB. Cap duro 25 MB. Si pesa más, usa un CDN (Mux / Cloudinary)             |
| Bitrate      | 1.5–2.5 Mbps para 1080p; 0.8–1.5 Mbps para 720p                                       |
| Poster       | JPG o WebP, mismo aspect ratio, < 200 KB                                              |

## Cómo comprimir (CLI con ffmpeg)

```bash
# MP4 H.264 optimizado para web (preset universal)
ffmpeg -i original.mov \
  -c:v libx264 -preset slow -crf 23 -movflags +faststart \
  -c:a aac -b:a 128k \
  -vf "scale=1280:-2" \
  demo.mp4

# WebM VP9 (mejor compresión, carga más rápida en navegadores modernos)
ffmpeg -i original.mov \
  -c:v libvpx-vp9 -b:v 1.2M -crf 32 \
  -c:a libopus -b:a 96k \
  -vf "scale=1280:-2" \
  demo.webm

# Poster desde un frame a los 2 segundos
ffmpeg -i original.mov -ss 00:00:02 -frames:v 1 -q:v 2 demo-poster.jpg
```

## Alternativas recomendadas para video de alta calidad

Si el video crece más allá de 10–15 MB, **no lo subas al repo**. Usa:

- **Mux** (`@mux/mux-player-react`) — transcodifica, sirve HLS adaptativo y genera poster automáticamente.
- **Cloudinary** (`next-cloudinary`) — optimización automática, trim, subtítulos.
- **YouTube unlisted** + `lite-youtube-embed` si es contenido marketing puro.

Next.js/Vercel cobran por bandwidth saliente; un CDN de video paga la pena desde el primer par de miles de vistas.

## Accesibilidad

- Siempre provee un **poster** para que el contenedor no esté vacío antes del play.
- Añade subtítulos (`.vtt`) para videos con diálogo.
- Usa `<track kind="captions" src="/videos/landing/demo.es.vtt" srclang="es" label="Español" default />`.
