import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const apiOrigin =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. Strict by default with a narrow allowlist for
// the few third parties we integrate with (Sentry, Vercel analytics/insights).
// En desarrollo se añaden orígenes ws:/wss: porque Next (Turbopack/HMR)
// abre un WebSocket contra el propio host para refrescar en caliente.
// In a follow-up we can migrate to nonce-based script-src to remove
// 'unsafe-inline'/'unsafe-eval' (needed today for Next dev + React Compiler).
const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  "object-src": ["'none'"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://va.vercel-scripts.com",
    "https://*.vercel-insights.com",
    "https://*.sentry.io",
  ],
  "connect-src": [
    "'self'",
    apiOrigin,
    "https://*.sentry.io",
    "https://*.ingest.sentry.io",
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
    ...(isDev ? ["ws:", "wss:", "http://localhost:*"] : []),
  ],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "frame-src": ["'self'"],
  ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
};

const cspValue = Object.entries(cspDirectives)
  .map(([directive, sources]) =>
    sources.length > 0 ? `${directive} ${sources.join(" ")}` : directive,
  )
  .join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspValue,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
