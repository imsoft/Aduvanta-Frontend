import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
  interface Window {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: Window & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https:\/\/api\./,
      handler: new NetworkFirst({ cacheName: 'api-cache', networkTimeoutSeconds: 10 }),
    },
    {
      matcher: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: new CacheFirst({ cacheName: 'image-cache' }),
    },
    {
      matcher: /\.(woff|woff2|ttf|otf)$/,
      handler: new CacheFirst({ cacheName: 'font-cache' }),
    },
    {
      matcher: /\/_next\/static\//,
      handler: new StaleWhileRevalidate({ cacheName: 'next-static' }),
    },
  ],
});

serwist.addEventListeners();
