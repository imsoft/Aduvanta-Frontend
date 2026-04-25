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
import { useTranslations } from 'next-intl'

type ModuleItem = {
  iconKey: string
  name: string
}

type Category = {
  title: string
  modules: ModuleItem[]
}

const iconMap: Record<string, Icon> = {
  scales: Scales,
  fileText: FileText,
  truck: Truck,
  currencyDollar: CurrencyDollar,
  invoice: Invoice,
  vault: Vault,
  folder: Folder,
  warehouse: Warehouse,
  chartBar: ChartBar,
  calculator: Calculator,
  bookOpen: BookOpen,
  warning: Warning,
}

export function PlatformSection() {
  const t = useTranslations('landing.platform')
  const categories = t.raw('categories') as Category[]

  return (
    <section className="border-y border-border/40 bg-muted/20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t('badge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {t('description')}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border border-border/50 bg-card p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {category.title}
              </h3>
              <div className="mt-4 space-y-3">
                {category.modules.map((mod) => {
                  const IconComp = iconMap[mod.iconKey] ?? FileText
                  return (
                    <div key={mod.name} className="flex items-center gap-3">
                      <IconComp
                        size={18}
                        weight="duotone"
                        className="shrink-0 text-primary"
                      />
                      <span className="text-sm font-medium">{mod.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
