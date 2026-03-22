import {
  FileText,
  Users,
  ShieldCheck,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'

type Feature = {
  icon: Icon
  badge: string
  title: string
  description: string
  bullets: string[]
}

const content = {
  'en-US': {
    sectionBadge: 'Product',
    sectionTitle: 'Pedimentos, TIGIE, Portal & Compliance — Built In',
    features: [
      {
        icon: FileText,
        badge: 'Pedimentos',
        title: 'From draft to release, tracked end to end',
        description:
          'Create, validate, and submit pedimentos without switching between systems. Every field validated against SAAI rules before submission.',
        bullets: [
          'Full lifecycle management (draft, prevalidation, submission, release)',
          'SAAI error reference built in — fix rejections fast',
          'Automatic Anexo 22 catalog lookups while you type',
        ],
      },
      {
        icon: Users,
        badge: 'Client Portal',
        title: 'Stop answering the same call 10 times a day',
        description:
          'Give each client their own login to track operations, view documents, and check status. They see what you want them to see — nothing more.',
        bullets: [
          'Clients self-serve their own status updates',
          'Permission-controlled visibility per client',
          'Professional image for your agency',
        ],
      },
      {
        icon: ShieldCheck,
        badge: 'Compliance & Audit',
        title: 'Every action recorded. Every change traceable.',
        description:
          'When SAT asks for documentation, you have it. Complete audit trail with who did what, when, and why — across every module.',
        bullets: [
          'Immutable audit logs on all sensitive mutations',
          'Role-based access with 60+ permission codes',
          'Organization-level data isolation',
        ],
      },
      {
        icon: Sparkle,
        badge: 'AI-Powered',
        title: 'Classify faster. Make fewer mistakes.',
        description:
          'AI-assisted tariff classification suggests fractions based on product descriptions. Cross-referenced with TIGIE in real time.',
        bullets: [
          'Intelligent tariff fraction suggestions',
          'Document analysis and data extraction',
          'Insights on operation patterns and anomalies',
        ],
      },
    ] satisfies Feature[],
  },
  'es-MX': {
    sectionBadge: 'Producto',
    sectionTitle: 'Pedimentos, TIGIE, Portal de Clientes y Cumplimiento — Integrados',
    features: [
      {
        icon: FileText,
        badge: 'Pedimentos',
        title: 'Del borrador al desaduanamiento, rastreado de principio a fin',
        description:
          'Crea, valida y envia pedimentos sin cambiar entre sistemas. Cada campo validado contra reglas SAAI antes del envio.',
        bullets: [
          'Gestion completa del ciclo (borrador, prevalidacion, envio, desaduanamiento)',
          'Referencia de errores SAAI integrada — corrige rechazos rapido',
          'Consulta automatica de catalogos Anexo 22 mientras capturas',
        ],
      },
      {
        icon: Users,
        badge: 'Portal de Clientes',
        title: 'Deja de contestar la misma llamada 10 veces al dia',
        description:
          'Dale a cada cliente su propio acceso para rastrear operaciones, ver documentos y consultar estatus. Ven lo que tu quieres que vean — nada mas.',
        bullets: [
          'Tus clientes consultan su propio estatus',
          'Visibilidad controlada por permisos por cliente',
          'Imagen profesional para tu agencia',
        ],
      },
      {
        icon: ShieldCheck,
        badge: 'Cumplimiento y Auditoria',
        title: 'Cada accion registrada. Cada cambio rastreable.',
        description:
          'Cuando el SAT pida documentacion, la tienes. Auditoria completa con quien hizo que, cuando y por que — en cada modulo.',
        bullets: [
          'Registros de auditoria inmutables en toda mutacion sensible',
          'Acceso por roles con 60+ codigos de permiso',
          'Aislamiento de datos por organizacion',
        ],
      },
      {
        icon: Sparkle,
        badge: 'Inteligencia Artificial',
        title: 'Clasifica mas rapido. Comete menos errores.',
        description:
          'Clasificacion arancelaria asistida por IA que sugiere fracciones basadas en descripciones de producto. Cruzada con TIGIE en tiempo real.',
        bullets: [
          'Sugerencias inteligentes de fracciones arancelarias',
          'Analisis de documentos y extraccion de datos',
          'Insights sobre patrones y anomalias en operaciones',
        ],
      },
    ] satisfies Feature[],
  },
} as const

type Props = {
  locale: string
}

export function FeaturesSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section id="product" className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.sectionBadge}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t.sectionTitle}
          </h2>
        </div>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
          {t.features.map((feature, i) => (
            <div
              key={feature.badge}
              className={`flex flex-col items-center gap-10 md:flex-row md:gap-16 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <feature.icon size={16} weight="duotone" className="text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {feature.description}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {feature.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full flex-1">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-muted/60">
                  <div className="flex h-full items-center justify-center">
                    <feature.icon
                      size={48}
                      weight="duotone"
                      className="text-muted-foreground/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
