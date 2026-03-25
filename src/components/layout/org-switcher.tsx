'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { CaretUpDown, Plus } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@/i18n/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { useOrgStore, type OrgOption } from '@/store/org.store'

async function fetchOrganizations(): Promise<OrgOption[]> {
  const { data } = await apiClient.get<OrgOption[]>('/api/organizations')
  return data
}

export function OrgSwitcher() {
  const router = useRouter()
  const t = useTranslations('organizations')
  const tRoles = useTranslations('roles')
  const { activeOrgId, organizations, setActiveOrg, setOrganizations } =
    useOrgStore()

  const { data } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  useEffect(() => {
    if (!data) return
    setOrganizations(data)
    if (!activeOrgId && data.length > 0) {
      setActiveOrg(data[0].id)
    }
  }, [data, activeOrgId, setActiveOrg, setOrganizations])

  const activeOrg = organizations.find((o) => o.id === activeOrgId)

  const roleLabel = (role: string) => {
    const key = role.toLowerCase() as 'owner' | 'admin' | 'member'
    if (key === 'owner' || key === 'admin' || key === 'member') {
      return tRoles(key)
    }
    return role
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-1.5 px-2 text-sm">
          <span className="max-w-32 truncate">
            {activeOrg?.name ?? t('selectOrganization')}
          </span>
          <CaretUpDown size={12} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t('menuLabel')}
        </DropdownMenuLabel>

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => setActiveOrg(org.id)}
            className="gap-2"
          >
            <span className="flex-1 truncate">{org.name}</span>
            {org.id === activeOrgId && (
              <span className="text-xs text-muted-foreground">
                {roleLabel(org.role)}
              </span>
            )}
          </DropdownMenuItem>
        ))}

        {organizations.length === 0 && (
          <DropdownMenuItem disabled className="text-muted-foreground">
            {t('empty')}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => router.push('/dashboard/organizations/new')}
          className="gap-2"
        >
          <Plus size={14} />
          {t('newOrganization')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
