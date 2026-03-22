import { X, Check } from '@phosphor-icons/react/dist/ssr'

const content = {
  'en-US': {
    badge: 'The Problem',
    title: 'Legacy customs software is costing you money',
    description:
      'Every hour spent fighting slow desktop apps, copying data between systems, and calling clients for status updates is an hour not spent on operations that generate revenue.',
    before: {
      label: 'Without Aduvanta',
      items: [
        'Manual data entry across 5+ disconnected systems',
        'Clients calling every hour asking for status',
        'Pedimento errors caught after submission',
        'Documents scattered in emails and USB drives',
        'No way to know who changed what and when',
        'Tied to a single office computer',
      ],
    },
    after: {
      label: 'With Aduvanta',
      items: [
        'One platform for everything — enter data once',
        'Clients track their own operations in real time',
        'Validation before submission, fewer rejections',
        'All documents organized with version control',
        'Complete audit trail on every action',
        'Work from anywhere, on any device',
      ],
    },
  },
  'es-MX': {
    badge: 'El Problema',
    title: 'Tu software aduanal actual te esta costando dinero',
    description:
      'Cada hora peleando con apps de escritorio lentas, copiando datos entre sistemas y llamando a clientes para dar estatus, es una hora que no inviertes en operaciones que generan ingresos.',
    before: {
      label: 'Sin Aduvanta',
      items: [
        'Captura manual en 5+ sistemas desconectados',
        'Clientes llamando cada hora preguntando por estatus',
        'Errores en pedimentos detectados despues del envio',
        'Documentos regados en emails y USB',
        'Sin saber quien cambio que ni cuando',
        'Atado a una sola computadora en la oficina',
      ],
    },
    after: {
      label: 'Con Aduvanta',
      items: [
        'Una plataforma para todo — captura una sola vez',
        'Tus clientes rastrean sus operaciones en tiempo real',
        'Validacion antes del envio, menos rectificaciones',
        'Documentos organizados con control de versiones',
        'Auditoria completa en cada accion',
        'Trabaja desde cualquier lugar, en cualquier dispositivo',
      ],
    },
  },
} as const

type Props = {
  locale: string
}

export function ProblemSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-destructive">
            {t.badge}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.description}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-6 sm:p-8">
            <p className="text-sm font-semibold text-destructive">{t.before.label}</p>
            <ul className="mt-5 space-y-4">
              {t.before.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X
                    size={16}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-destructive/60"
                  />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 sm:p-8">
            <p className="text-sm font-semibold text-primary">{t.after.label}</p>
            <ul className="mt-5 space-y-4">
              {t.after.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={16}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
