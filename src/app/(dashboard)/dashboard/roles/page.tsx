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

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: 'Organizations',
    permissions: [
      { code: 'organizations.read', label: 'View organization', roles: ['OWNER', 'ADMIN', 'MEMBER'] },
      { code: 'organizations.update', label: 'Edit organization settings', roles: ['OWNER'] },
      { code: 'organizations.delete', label: 'Delete organization', roles: ['OWNER'] },
    ],
  },
  {
    label: 'Members',
    permissions: [
      { code: 'members.read', label: 'View members', roles: ['OWNER', 'ADMIN', 'MEMBER'] },
      { code: 'members.invite', label: 'Invite members', roles: ['OWNER', 'ADMIN'] },
      { code: 'members.remove', label: 'Remove members', roles: ['OWNER', 'ADMIN'] },
      { code: 'members.update_role', label: 'Change member roles', roles: ['OWNER', 'ADMIN'] },
    ],
  },
  {
    label: 'Roles',
    permissions: [
      { code: 'roles.read', label: 'View roles', roles: ['OWNER', 'ADMIN'] },
      { code: 'roles.manage', label: 'Manage roles', roles: ['OWNER'] },
    ],
  },
  {
    label: 'Audit Logs',
    permissions: [
      { code: 'audit_logs.read', label: 'View audit logs', roles: ['OWNER', 'ADMIN'] },
    ],
  },
  {
    label: 'Users',
    permissions: [
      { code: 'users.read', label: 'View user profiles', roles: ['OWNER', 'ADMIN', 'MEMBER'] },
    ],
  },
];

const ROLE_VARIANT: Record<Role, 'default' | 'secondary' | 'outline'> = {
  OWNER: 'default',
  ADMIN: 'secondary',
  MEMBER: 'outline',
};

export default function RolesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Permission matrix for each role in your organization
        </p>
      </div>

      <div className="flex gap-3">
        {ROLES.map((role) => (
          <div key={role} className="flex items-center gap-2 rounded-lg border px-4 py-3">
            <Badge variant={ROLE_VARIANT[role]}>{role}</Badge>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.label} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {group.label}
            </h2>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Permission</TableHead>
                    {ROLES.map((role) => (
                      <TableHead key={role} className="w-24 text-center">
                        {role}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.permissions.map((perm) => (
                    <TableRow key={perm.code}>
                      <TableCell>
                        <p className="text-sm">{perm.label}</p>
                        <p className="font-mono text-xs text-muted-foreground">{perm.code}</p>
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
