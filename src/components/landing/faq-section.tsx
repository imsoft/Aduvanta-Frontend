'use client'

import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'

type FaqItem = {
  question: string
  answer: string
}

const content = {
  'en-US': {
    badge: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      {
        question: 'What is Aduvanta?',
        answer:
          'Aduvanta is a modern web platform that replaces legacy desktop software for customs and foreign trade operations. It provides customs agencies, importers, and exporters with real-time operations management, full traceability, and enterprise-grade security in a single unified platform.',
      },
      {
        question: 'Who is Aduvanta for?',
        answer:
          'Aduvanta is designed for customs agencies (agencias aduanales), independent customs brokers, importers, exporters, IMMEX companies, and logistics operators in Mexico. Anyone involved in customs operations can benefit from the platform.',
      },
      {
        question: 'How does Aduvanta compare to Sistemas CASA?',
        answer:
          'While Sistemas CASA offers 13 separate Windows desktop applications, Aduvanta provides all functionality in a single modern web platform accessible from anywhere. Aduvanta includes features not available in legacy software: client portal, AI-powered classification, real-time collaboration, mobile access, and API integrations.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Absolutely. Aduvanta uses enterprise-grade security with encrypted data at rest and in transit, role-based access control with 60+ permission codes, complete audit trails, and infrastructure hosted on Neon PostgreSQL with automated backups. Your data is fully isolated per organization.',
      },
      {
        question: 'Can I manage multiple organizations?',
        answer:
          'Yes. Aduvanta is multi-tenant from day one. You can manage multiple organizations, each with its own users, roles, permissions, and data. Users can belong to multiple organizations with different roles in each.',
      },
      {
        question: 'Is there a free trial?',
        answer:
          'Yes, we offer a free trial so you can explore the platform before committing. No credit card required. Contact us to get started.',
      },
      {
        question: 'Can my clients see their operations?',
        answer:
          'Yes. The Client Portal feature allows your clients to track their operations, view documents, and receive real-time status updates through a dedicated, permission-controlled interface.',
      },
      {
        question: 'What reference data is included?',
        answer:
          'Aduvanta includes all 13 Anexo 22 SAT catalogs (customs sections, pedimento keys, customs regimes, countries, currencies, taxes, and more), a complete SAAI error code catalog, TIGIE tariff data, and a unit converter with 100+ measurement units.',
      },
    ] satisfies FaqItem[],
  },
  'es-MX': {
    badge: 'FAQ',
    title: 'Preguntas frecuentes',
    items: [
      {
        question: 'Que es Aduvanta?',
        answer:
          'Aduvanta es una plataforma web moderna que reemplaza el software de escritorio para operaciones aduaneras y de comercio exterior. Proporciona a agencias aduanales, importadores y exportadores gestion de operaciones en tiempo real, trazabilidad completa y seguridad empresarial en una sola plataforma unificada.',
      },
      {
        question: 'Para quien es Aduvanta?',
        answer:
          'Aduvanta esta disenada para agencias aduanales, agentes aduanales independientes, importadores, exportadores, empresas IMMEX y operadores logisticos en Mexico. Cualquier persona involucrada en operaciones aduaneras puede beneficiarse de la plataforma.',
      },
      {
        question: 'Como se compara Aduvanta con Sistemas CASA?',
        answer:
          'Mientras que Sistemas CASA ofrece 13 aplicaciones de escritorio Windows separadas, Aduvanta proporciona toda la funcionalidad en una sola plataforma web moderna accesible desde cualquier lugar. Aduvanta incluye funcionalidades no disponibles en software legacy: portal de clientes, clasificacion con IA, colaboracion en tiempo real, acceso movil e integraciones por API.',
      },
      {
        question: 'Mis datos estan seguros?',
        answer:
          'Absolutamente. Aduvanta utiliza seguridad de nivel empresarial con datos encriptados en reposo y en transito, control de acceso por roles con 60+ codigos de permiso, registro completo de auditoria e infraestructura hospedada en Neon PostgreSQL con respaldos automaticos. Tus datos estan completamente aislados por organizacion.',
      },
      {
        question: 'Puedo gestionar multiples organizaciones?',
        answer:
          'Si. Aduvanta es multi-tenant desde el primer dia. Puedes gestionar multiples organizaciones, cada una con sus propios usuarios, roles, permisos y datos. Los usuarios pueden pertenecer a multiples organizaciones con diferentes roles en cada una.',
      },
      {
        question: 'Hay prueba gratuita?',
        answer:
          'Si, ofrecemos una prueba gratuita para que explores la plataforma antes de comprometerte. Sin tarjeta de credito requerida. Contactanos para comenzar.',
      },
      {
        question: 'Mis clientes pueden ver sus operaciones?',
        answer:
          'Si. La funcionalidad de Portal de Clientes permite que tus clientes rastreen sus operaciones, vean documentos y reciban actualizaciones de estatus en tiempo real a traves de una interfaz dedicada y controlada por permisos.',
      },
      {
        question: 'Que datos de referencia incluye?',
        answer:
          'Aduvanta incluye los 13 catalogos de Anexo 22 del SAT (secciones aduaneras, claves de pedimento, regimenes aduaneros, paises, monedas, contribuciones y mas), un catalogo completo de errores SAAI, datos de tarifa TIGIE y un conversor de unidades con 100+ unidades de medida.',
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
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border/50">
          {t.items.map((item, index) => (
            <div key={item.question} className="py-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-2 text-left"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-medium">{item.question}</span>
                <CaretDown
                  size={18}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="pb-2 pt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
