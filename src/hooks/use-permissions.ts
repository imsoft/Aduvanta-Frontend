import { useOrgStore } from '@/store/org.store';
import { useIsSystemAdmin } from './use-current-user';

const MANAGEMENT_ROLES = new Set(['OWNER', 'ADMIN']);
const COMMENT_ROLES = new Set(['OWNER', 'ADMIN', 'MEMBER']);

function useActiveOrg() {
  return useOrgStore((s) =>
    s.organizations.find((o) => o.id === s.activeOrgId),
  );
}

export function useCanManage(): boolean {
  const isSystemAdmin = useIsSystemAdmin();
  const activeOrg = useActiveOrg();
  if (isSystemAdmin) return true;
  return !!activeOrg && MANAGEMENT_ROLES.has(activeOrg.role);
}

export function useCanComment(): boolean {
  const isSystemAdmin = useIsSystemAdmin();
  const activeOrg = useActiveOrg();
  if (isSystemAdmin) return true;
  return !!activeOrg && COMMENT_ROLES.has(activeOrg.role);
}

export function useIsOwner(): boolean {
  const isSystemAdmin = useIsSystemAdmin();
  const activeOrg = useActiveOrg();
  if (isSystemAdmin) return true;
  return activeOrg?.role === 'OWNER';
}
