import {
  UserPlus,
  Buildings,
  Rocket,
} from '@phosphor-icons/react/dist/ssr'

const content = {
  'en-US': {
    badge: 'How It Works',
    title: 'Up and running in 15 minutes',
    steps: [
      {
        icon: UserPlus,
        number: '01',
        title: 'Create your account',
        description:
          'Sign up, verify your email, and you\'re in. No downloads, no installations, no IT department needed.',
      },
      {
        icon: Buildings,
        number: '02',
        title: 'Set up your organization',
        description:
          'Add your team, assign roles, and configure permissions. Invite your clients to their own portal.',
      },
      {
        icon: Rocket,
        number: '03',
        title: 'Start operating',
        description:
          'Create your first pedimento, upload documents, track operations. Everything from your browser.',
      },
    ],
  },
  'es-MX': {
    badge: 'Como Funciona',
    title: 'Operando en 15 minutos',
    steps: [
      {
        icon: UserPlus,
        number: '01',
        title: 'Crea tu cuenta',
        description:
          'Registrate, verifica tu email y listo. Sin descargas, sin instalaciones, sin necesitar al departamento de TI.',
      },
      {
        icon: Buildings,
        number: '02',
        title: 'Configura tu organizacion',
        description:
          'Agrega a tu equipo, asigna roles y configura permisos. Invita a tus clientes a su propio portal.',
      },
      {
        icon: Rocket,
        number: '03',
        title: 'Empieza a operar',
        description:
          'Crea tu primer pedimento, sube documentos, rastrea operaciones. Todo desde tu navegador.',
      },
    ],
  },
} as const

type Props = {
  locale: string
}

export function HowItWorksSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="border-y border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.badge}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:mt-16 md:grid-cols-3 md:gap-6">
          {t.steps.map((step) => (
            <div key={step.number} className="relative text-center md:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 md:mx-0">
                <step.icon size={22} weight="duotone" className="text-primary" />
              </div>
              <div className="mt-2 text-xs font-bold text-primary/50">{step.number}</div>
              <h3 className="mt-1 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
