const content = {
  'en-US': {
    badge: 'Testimonials',
    title: 'What our users are saying',
    testimonials: [
      {
        quote:
          'We switched from CASA and saved 3 hours per day just on pedimento entry. Our clients love the portal — they stopped calling for status updates.',
        name: 'Maria Gonzalez',
        role: 'Director, Agencia Aduanal MG',
      },
      {
        quote:
          'The audit trail alone justified the switch. When SAT audited us, we pulled every record in minutes instead of days.',
        name: 'Carlos Hernandez',
        role: 'Compliance Manager, TradeLink MX',
      },
      {
        quote:
          'Finally, a customs platform that feels like software built in this decade. My team was up and running the same day.',
        name: 'Ana Torres',
        role: 'Operations Lead, GlobalFreight',
      },
    ],
  },
  'es-MX': {
    badge: 'Testimonios',
    title: 'Lo que dicen nuestros usuarios',
    testimonials: [
      {
        quote:
          'Migramos de CASA y ahorramos 3 horas al dia solo en captura de pedimentos. A nuestros clientes les encanta el portal — dejaron de llamar para preguntar por estatus.',
        name: 'Maria Gonzalez',
        role: 'Directora, Agencia Aduanal MG',
      },
      {
        quote:
          'Solo la auditoria justifico el cambio. Cuando el SAT nos audito, sacamos cada registro en minutos en lugar de dias.',
        name: 'Carlos Hernandez',
        role: 'Gerente de Cumplimiento, TradeLink MX',
      },
      {
        quote:
          'Por fin, una plataforma aduanera que se siente como software hecho en esta decada. Mi equipo estuvo operando el mismo dia.',
        name: 'Ana Torres',
        role: 'Lider de Operaciones, GlobalFreight',
      },
    ],
  },
} as const

type Props = {
  locale: string
}

export function TestimonialsSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.badge}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {t.testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-2xl border border-border/50 bg-card p-6"
            >
              <blockquote className="flex-1">
                <p className="text-sm leading-relaxed text-foreground/80">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-5 border-t border-border/30 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-bold text-primary">
                      {item.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
