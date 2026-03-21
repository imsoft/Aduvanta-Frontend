import {
  Scales,
  FileText,
  Truck,
  CurrencyDollar,
  Stamp,
  Invoice,
  Vault,
  Folder,
  Warehouse,
  Envelope,
  ChartBar,
  Sparkle,
  Calculator,
  BookOpen,
  Warning,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'

type ModuleItem = {
  icon: Icon
  title: string
  description: string
}

const content = {
  'en-US': {
    badge: 'Complete Platform',
    title: 'Everything you need in one place',
    description:
      'From tariff classification to billing, every module designed for Mexican customs workflows.',
    modules: [
      {
        icon: Scales,
        title: 'Tariff Classification',
        description: 'TIGIE lookups, tariff fraction search, and classification management',
      },
      {
        icon: FileText,
        title: 'Customs Entries',
        description: 'Full pedimento lifecycle with status tracking and document attachment',
      },
      {
        icon: Truck,
        title: 'Customs Operations',
        description: 'Traffic management, operation timelines, and workflow automation',
      },
      {
        icon: CurrencyDollar,
        title: 'Customs Valuation',
        description: 'Transaction value calculation, incremental costs, and valuation methods',
      },
      {
        icon: Stamp,
        title: 'COVE / E-Documents',
        description: 'Electronic document generation and VUCEM integration ready',
      },
      {
        icon: Invoice,
        title: 'Billing',
        description: 'Invoice management, payment tracking, and expense accounts',
      },
      {
        icon: Vault,
        title: 'Treasury',
        description: 'Bank accounts, movements, transfers, and reconciliation',
      },
      {
        icon: Folder,
        title: 'Document Management',
        description: 'Templates, checklists, version control, and organized folders',
      },
      {
        icon: Warehouse,
        title: 'Warehouse Control',
        description: 'Inventory tracking, zones, movements, and bonded warehouse management',
      },
      {
        icon: Envelope,
        title: 'Notifications',
        description: 'Multi-channel alerts, preferences, and real-time status updates',
      },
      {
        icon: ChartBar,
        title: 'Analytics & BI',
        description: 'Custom reports, KPI dashboards, and export to multiple formats',
      },
      {
        icon: Sparkle,
        title: 'AI Assistant',
        description: 'Intelligent tariff classification, document analysis, and insights',
      },
      {
        icon: Calculator,
        title: 'Unit Converter',
        description: '13 categories, 100+ units for weight, length, volume, and more',
      },
      {
        icon: BookOpen,
        title: 'Anexo 22',
        description: '13 official SAT catalogs for pedimento reference data',
      },
      {
        icon: Warning,
        title: 'SAAI Errors',
        description: 'Complete error code catalog with descriptions and suggested fixes',
      },
    ] satisfies ModuleItem[],
  },
  'es-MX': {
    badge: 'Plataforma Completa',
    title: 'Todo lo que necesitas en un solo lugar',
    description:
      'Desde clasificacion arancelaria hasta facturacion, cada modulo disenado para los flujos aduaneros mexicanos.',
    modules: [
      {
        icon: Scales,
        title: 'Clasificacion Arancelaria',
        description: 'Consultas TIGIE, busqueda de fracciones arancelarias y gestion de clasificacion',
      },
      {
        icon: FileText,
        title: 'Pedimentos',
        description: 'Ciclo de vida completo del pedimento con seguimiento de estatus y documentos',
      },
      {
        icon: Truck,
        title: 'Operaciones Aduaneras',
        description: 'Gestion de trafico, lineas de tiempo y automatizacion de flujos',
      },
      {
        icon: CurrencyDollar,
        title: 'Valoracion Aduanera',
        description: 'Calculo de valor de transaccion, costos incrementables y metodos de valoracion',
      },
      {
        icon: Stamp,
        title: 'COVE / E-Documents',
        description: 'Generacion de documentos electronicos y preparado para VUCEM',
      },
      {
        icon: Invoice,
        title: 'Facturacion',
        description: 'Gestion de facturas, seguimiento de pagos y cuentas de gastos',
      },
      {
        icon: Vault,
        title: 'Tesoreria',
        description: 'Cuentas bancarias, movimientos, transferencias y conciliacion',
      },
      {
        icon: Folder,
        title: 'Gestion Documental',
        description: 'Plantillas, checklists, control de versiones y carpetas organizadas',
      },
      {
        icon: Warehouse,
        title: 'Control de Almacenes',
        description: 'Rastreo de inventario, zonas, movimientos y almacen fiscal',
      },
      {
        icon: Envelope,
        title: 'Notificaciones',
        description: 'Alertas multicanal, preferencias y actualizaciones en tiempo real',
      },
      {
        icon: ChartBar,
        title: 'Analitica & BI',
        description: 'Reportes personalizados, dashboards KPI y exportacion a multiples formatos',
      },
      {
        icon: Sparkle,
        title: 'Asistente IA',
        description: 'Clasificacion arancelaria inteligente, analisis de documentos e insights',
      },
      {
        icon: Calculator,
        title: 'Conversor de Unidades',
        description: '13 categorias, 100+ unidades de peso, longitud, volumen y mas',
      },
      {
        icon: BookOpen,
        title: 'Anexo 22',
        description: '13 catalogos oficiales del SAT para datos de referencia de pedimentos',
      },
      {
        icon: Warning,
        title: 'Errores SAAI',
        description: 'Catalogo completo de codigos de error con descripciones y soluciones sugeridas',
      },
    ] satisfies ModuleItem[],
  },
} as const

type Props = {
  locale: string
}

export function ModulesSection({ locale }: Props) {
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']

  return (
    <section id="modules" className="py-20 sm:py-28">
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
          <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.modules.map((mod) => (
            <div
              key={mod.title}
              className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/20 hover:bg-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <mod.icon
                  size={20}
                  weight="duotone"
                  className="text-primary"
                />
              </div>
              <div>
                <h3 className="font-semibold">{mod.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {mod.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
