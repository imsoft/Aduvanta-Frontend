import {
  ShieldCheck,
  Users,
  Buildings,
  ClockCountdown,
  FileText,
  Lock,
} from '@phosphor-icons/react/dist/ssr'

const content = {
  'en-US': {
    badge: 'Why Aduvanta',
    title: 'Built for serious customs operations',
    description:
      'Every feature designed for the complexity and compliance requirements of Mexican customs and foreign trade.',
    features: [
      {
        icon: Buildings,
        title: 'Multi-Tenant',
        description:
          'Manage multiple organizations from a single account. Each tenant is fully isolated with its own data, roles, and configurations.',
      },
      {
        icon: ShieldCheck,
        title: 'Role-Based Access',
        description:
          'Granular permissions with 60+ permission codes. Control exactly who can see, create, edit, or delete each resource.',
      },
      {
        icon: FileText,
        title: 'Full Audit Trail',
        description:
          'Every sensitive action is logged with user, timestamp, and context. Meet compliance requirements with immutable audit records.',
      },
      {
        icon: Users,
        title: 'Client Portal',
        description:
          'Give your clients real-time visibility into their operations, documents, and status updates through a dedicated portal.',
      },
      {
        icon: ClockCountdown,
        title: 'Real-Time Operations',
        description:
          'Track every pedimento, document, and customs entry in real time. Status updates, notifications, and alerts keep everyone in sync.',
      },
      {
        icon: Lock,
        title: 'Enterprise Security',
        description:
          'Bank-grade encryption, secure session management, and infrastructure on Neon PostgreSQL with automated backups.',
      },
    ],
  },
  'es-MX': {
    badge: 'Por que Aduvanta',
    title: 'Construida para operaciones aduaneras serias',
    description:
      'Cada funcionalidad disenada para la complejidad y los requisitos de cumplimiento del comercio exterior mexicano.',
    features: [
      {
        icon: Buildings,
        title: 'Multi-Tenant',
        description:
          'Gestiona multiples organizaciones desde una sola cuenta. Cada tenant esta completamente aislado con sus propios datos, roles y configuraciones.',
      },
      {
        icon: ShieldCheck,
        title: 'Control de Acceso por Roles',
        description:
          'Permisos granulares con 60+ codigos de permiso. Controla exactamente quien puede ver, crear, editar o eliminar cada recurso.',
      },
      {
        icon: FileText,
        title: 'Auditoria Completa',
        description:
          'Cada accion sensible se registra con usuario, fecha y contexto. Cumple requisitos de auditoria con registros inmutables.',
      },
      {
        icon: Users,
        title: 'Portal de Clientes',
        description:
          'Da a tus clientes visibilidad en tiempo real de sus operaciones, documentos y actualizaciones de estatus a traves de un portal dedicado.',
      },
      {
        icon: ClockCountdown,
        title: 'Operaciones en Tiempo Real',
        description:
          'Rastrea cada pedimento, documento y entrada aduanera en tiempo real. Actualizaciones de estatus, notificaciones y alertas mantienen a todos sincronizados.',
      },
      {
        icon: Lock,
        title: 'Seguridad Empresarial',
        description:
          'Encriptacion de nivel bancario, gestion segura de sesiones e infraestructura en Neon PostgreSQL con respaldos automaticos.',
      },
    ],
  },
} as const

type Props = {
  locale: string
}

export function FeaturesSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section id="features" className="border-t border-border/50 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-background px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon
                  size={22}
                  weight="duotone"
                  className="text-primary"
                />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
