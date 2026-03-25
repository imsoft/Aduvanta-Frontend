'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ROLES = ['OWNER', 'ADMIN', 'MEMBER'] as const;
type Role = (typeof ROLES)[number];

interface PermissionGroup {
  label: string;
  permissions: { code: string; label: string; roles: Role[] }[];
}

const ROLE_VARIANT: Record<Role, 'default' | 'secondary' | 'outline'> = {
  OWNER: 'default',
  ADMIN: 'secondary',
  MEMBER: 'outline',
};

const ROLE_TRANSLATION_KEY: Record<Role, string> = {
  OWNER: 'roles.owner',
  ADMIN: 'roles.admin',
  MEMBER: 'roles.member',
};

export default function RolesPage() {
  const t = useTranslations();

  const permissionGroups: PermissionGroup[] = [
    {
      label: t('permissions.organizations'),
      permissions: [
        { code: 'organizations.read', label: t('permissions.viewOrganization'), roles: ['OWNER', 'ADMIN', 'MEMBER'] },
        { code: 'organizations.update', label: t('permissions.editOrganizationSettings'), roles: ['OWNER'] },
        { code: 'organizations.delete', label: t('permissions.deleteOrganization'), roles: ['OWNER'] },
      ],
    },
    {
      label: t('permissions.members'),
      permissions: [
        { code: 'members.read', label: t('permissions.viewMembers'), roles: ['OWNER', 'ADMIN', 'MEMBER'] },
        { code: 'members.invite', label: t('permissions.inviteMembers'), roles: ['OWNER', 'ADMIN'] },
        { code: 'members.remove', label: t('permissions.removeMembers'), roles: ['OWNER', 'ADMIN'] },
        { code: 'members.update_role', label: t('permissions.changeMemberRoles'), roles: ['OWNER', 'ADMIN'] },
      ],
    },
    {
      label: t('permissions.roles'),
      permissions: [
        { code: 'roles.read', label: t('permissions.viewRoles'), roles: ['OWNER', 'ADMIN'] },
        { code: 'roles.manage', label: t('permissions.manageRoles'), roles: ['OWNER'] },
      ],
    },
    {
      label: t('permissions.auditLogs'),
      permissions: [
        { code: 'audit_logs.read', label: t('permissions.viewAuditLogs'), roles: ['OWNER', 'ADMIN'] },
      ],
    },
    {
      label: t('permissions.users'),
      permissions: [
        { code: 'users.read', label: t('permissions.viewUserProfiles'), roles: ['OWNER', 'ADMIN', 'MEMBER'] },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('rolesPage.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('rolesPage.description')}
        </p>
      </div>

      <div className="flex gap-3">
        {ROLES.map((role) => (
          <div key={role} className="flex items-center gap-2 rounded-lg border px-4 py-3">
            <Badge variant={ROLE_VARIANT[role]}>{t(ROLE_TRANSLATION_KEY[role])}</Badge>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {permissionGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {group.label}
            </h2>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">{t('rolesPage.permission')}</TableHead>
                    {ROLES.map((role) => (
                      <TableHead key={role} className="w-24 text-center">
                        {t(ROLE_TRANSLATION_KEY[role])}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.permissions.map((perm) => (
                    <TableRow key={perm.code}>
                      <TableCell>
                        <p className="text-sm">{perm.label}</p>
                        {/* Mostramos el label traducido; el código es para debugging y confunde en UI */}
                      </TableCell>
                      {ROLES.map((role) => (
                        <TableCell key={role} className="text-center">
                          {perm.roles.includes(role) ? (
                            <span className="text-green-600 font-semibold text-base leading-none">✓</span>
                          ) : (
                            <span className="text-muted-foreground/40 text-base leading-none">—</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
