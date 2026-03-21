'use client'

import { useState } from 'react'
import { Plus, Minus } from '@phosphor-icons/react'

type FaqItem = {
  question: string
  answer: string
}

const content = {
  'en-US': {
    badge: 'FAQ',
    title: 'Common questions',
    items: [
      {
        question: 'How long does it take to get started?',
        answer:
          'About 15 minutes. Sign up, create your organization, invite your team, and you can start creating pedimentos immediately. No installation, no IT setup, no migration required to begin.',
      },
      {
        question: 'Can I migrate my data from CASA or other systems?',
        answer:
          'Yes. We offer guided migration for Professional and Enterprise plans. Our team helps you import historical data so you don\'t lose continuity. Starter users can begin fresh and import data as needed.',
      },
      {
        question: 'Is my data safe?',
        answer:
          'Your data is encrypted at rest and in transit, hosted on Neon PostgreSQL with automated daily backups. Each organization\'s data is fully isolated. We maintain complete audit trails and role-based access control with 60+ granular permissions.',
      },
      {
        question: 'Can my clients access the platform?',
        answer:
          'Yes. The Client Portal gives each client their own login to track operations, view documents, and check status — with permission controls so they only see what you allow. Available on Professional and Enterprise plans.',
      },
      {
        question: 'What happens after the 14-day trial?',
        answer:
          'You choose a plan and continue using the platform with all your data intact. If you decide not to continue, your data is available for export for 30 days after the trial ends. No surprise charges.',
      },
      {
        question: 'Do I need to install anything?',
        answer:
          'No. Aduvanta is entirely web-based and works in any modern browser (Chrome, Firefox, Safari, Edge). No downloads, no plugins, no Java — just open your browser and log in.',
      },
    ] satisfies FaqItem[],
  },
  'es-MX': {
    badge: 'FAQ',
    title: 'Preguntas frecuentes',
    items: [
      {
        question: 'Cuanto tiempo toma empezar?',
        answer:
          'Unos 15 minutos. Registrate, crea tu organizacion, invita a tu equipo y puedes empezar a crear pedimentos inmediatamente. Sin instalacion, sin configuracion de TI, sin migracion obligatoria para comenzar.',
      },
      {
        question: 'Puedo migrar mis datos de CASA u otros sistemas?',
        answer:
          'Si. Ofrecemos migracion guiada para planes Professional y Enterprise. Nuestro equipo te ayuda a importar datos historicos para que no pierdas continuidad. Usuarios Starter pueden empezar desde cero e importar datos conforme los necesiten.',
      },
      {
        question: 'Mis datos estan seguros?',
        answer:
          'Tus datos estan encriptados en reposo y en transito, hospedados en Neon PostgreSQL con respaldos automaticos diarios. Los datos de cada organizacion estan completamente aislados. Mantenemos auditoria completa y control de acceso por roles con 60+ permisos granulares.',
      },
      {
        question: 'Mis clientes pueden acceder a la plataforma?',
        answer:
          'Si. El Portal de Clientes le da a cada cliente su propio acceso para rastrear operaciones, ver documentos y consultar estatus — con controles de permisos para que solo vean lo que tu permitas. Disponible en planes Professional y Enterprise.',
      },
      {
        question: 'Que pasa despues de los 14 dias de prueba?',
        answer:
          'Eliges un plan y continuas usando la plataforma con todos tus datos intactos. Si decides no continuar, tus datos estan disponibles para exportar por 30 dias despues de que termine la prueba. Sin cargos sorpresa.',
      },
      {
        question: 'Necesito instalar algo?',
        answer:
          'No. Aduvanta es completamente web y funciona en cualquier navegador moderno (Chrome, Firefox, Safari, Edge). Sin descargas, sin plugins, sin Java — solo abre tu navegador e inicia sesion.',
      },
    ] satisfies FaqItem[],
  },
} as const

type Props = {
  locale: string
}

export function FaqSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="border-t border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-[280px_1fr] md:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t.badge}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {t.title}
            </h2>
          </div>

          <div className="divide-y divide-border/40">
            {t.items.map((item, index) => (
              <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="text-sm font-semibold sm:text-base">
                    {item.question}
                  </span>
                  {openIndex === index ? (
                    <Minus size={16} weight="bold" className="mt-1 shrink-0 text-primary" />
                  ) : (
                    <Plus size={16} weight="bold" className="mt-1 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openIndex === index && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
