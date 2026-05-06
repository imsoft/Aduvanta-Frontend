import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aduvanta — Plataforma Aduanal',
    short_name: 'Aduvanta',
    description: 'Gestión integral de operaciones aduanales y comercio exterior',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#fdfcfe',
    theme_color: '#03035e',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/brand/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/brand/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'productivity'],
  };
}
