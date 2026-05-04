'use client'

import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getDashboardGuide } from '@/features/dashboard-guide/dashboard-guide-content'
import { useIsSystemAdmin } from '@/features/system-admin/hooks/use-system-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function GuiaPage() {
  const locale = useLocale()
  const g = getDashboardGuide(locale)
  const { data: admin } = useIsSystemAdmin()
  const isSuperAdmin = admin?.isSystemAdmin === true

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{g.pageTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{g.pageSubtitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">{g.intro}</p>
        <p className="mt-2 text-sm text-muted-foreground">{g.permissionsNote}</p>
      </div>

      <Separator />

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">{g.tenantSectionTitle}</h2>
        {g.tenantGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h3>
            <div className="space-y-4">
              {group.pages.map((page) => (
                <Card key={page.path}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      <Link
                        href={page.path}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {page.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                      {page.bullets.map((line, i) => (
                        <li key={`${page.path}-${i}`}>{line}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="text-sm text-muted-foreground">{g.settingsNote}</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{g.extraRoutesTitle}</h2>
        <div className="space-y-3">
          {g.extraRoutes.map((er) => (
            <Card key={er.path}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  <Link
                    href={er.path}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {er.title}
                  </Link>
                </CardTitle>
                <CardDescription>{er.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {isSuperAdmin && (
        <>
          <Separator />
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">{g.adminSectionTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{g.adminIntro}</p>
            </div>
            {g.adminGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {group.title}
                </h3>
                <div className="space-y-4">
                  {group.pages.map((page) => (
                    <Card key={page.path} className="border-amber-500/25">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          <Link
                            href={page.path}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            {page.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                          {page.bullets.map((line, i) => (
                            <li key={`${page.path}-${i}`}>{line}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
