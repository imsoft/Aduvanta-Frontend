import {
  Scales,
  FileText,
  Truck,
  CurrencyDollar,
  Invoice,
  Vault,
  Folder,
  Warehouse,
  ChartBar,
  Calculator,
  BookOpen,
  Warning,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'

type ModuleItem = {
  icon: Icon
  name: string
}

type Category = {
  title: string
  modules: ModuleItem[]
}

const content = {
  'en-US': {
    badge: 'Platform',
    title: 'One platform. Every module you need.',
    description:
      'Stop paying for 13 separate apps. Aduvanta covers your entire operation.',
    categories: [
      {
        title: 'Customs & Trade',
        modules: [
          { icon: FileText, name: 'Pedimentos' },
          { icon: Scales, name: 'Tariff Classification' },
          { icon: CurrencyDollar, name: 'Customs Valuation' },
          { icon: Truck, name: 'Operations & Traffic' },
        ],
      },
      {
        title: 'Finance & Billing',
        modules: [
          { icon: Invoice, name: 'Invoicing' },
          { icon: Vault, name: 'Treasury' },
          { icon: ChartBar, name: 'Analytics & BI' },
        ],
      },
      {
        title: 'Documents & Compliance',
        modules: [
          { icon: Folder, name: 'Document Management' },
          { icon: Warehouse, name: 'Warehouse Control' },
          { icon: BookOpen, name: 'Anexo 22 Catalogs' },
        ],
      },
      {
        title: 'Reference Tools',
        modules: [
          { icon: Warning, name: 'SAAI Error Codes' },
          { icon: Calculator, name: 'Unit Converter' },
        ],
      },
    ] satisfies Category[],
  },
  'es-MX': {
    badge: 'Plataforma',
    title: 'Una plataforma. Cada modulo que necesitas.',
    description:
      'Deja de pagar por 13 apps separadas. Aduvanta cubre toda tu operacion.',
    categories: [
      {
        title: 'Aduanas y Comercio',
        modules: [
          { icon: FileText, name: 'Pedimentos' },
          { icon: Scales, name: 'Clasificacion Arancelaria' },
          { icon: CurrencyDollar, name: 'Valoracion Aduanera' },
          { icon: Truck, name: 'Operaciones y Trafico' },
        ],
      },
      {
        title: 'Finanzas y Facturacion',
        modules: [
          { icon: Invoice, name: 'Facturacion' },
          { icon: Vault, name: 'Tesoreria' },
          { icon: ChartBar, name: 'Analitica y BI' },
        ],
      },
      {
        title: 'Documentos y Cumplimiento',
        modules: [
          { icon: Folder, name: 'Gestion Documental' },
          { icon: Warehouse, name: 'Control de Almacenes' },
          { icon: BookOpen, name: 'Catalogos Anexo 22' },
        ],
      },
      {
        title: 'Herramientas de Referencia',
        modules: [
          { icon: Warning, name: 'Errores SAAI' },
          { icon: Calculator, name: 'Conversor de Unidades' },
        ],
      },
    ] satisfies Category[],
  },
} as const

type Props = {
  locale: string
}

export function PlatformSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section className="border-y border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.badge}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {t.description}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2">
          {t.categories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border border-border/50 bg-card p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {category.title}
              </h3>
              <div className="mt-4 space-y-3">
                {category.modules.map((mod) => (
                  <div key={mod.name} className="flex items-center gap-3">
                    <mod.icon
                      size={18}
                      weight="duotone"
                      className="shrink-0 text-primary"
                    />
                    <span className="text-sm font-medium">{mod.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
