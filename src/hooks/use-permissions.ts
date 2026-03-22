import { useOrgStore } from '@/store/org.store';

const MANAGEMENT_ROLES = new Set(['OWNER', 'ADMIN']);
const COMMENT_ROLES = new Set(['OWNER', 'ADMIN', 'MEMBER']);

function useActiveOrg() {
  return useOrgStore((s) =>
    s.organizations.find((o) => o.id === s.activeOrgId),
  );
}

export function useCanManage(): boolean {
  const activeOrg = useActiveOrg();
  return !!activeOrg && MANAGEMENT_ROLES.has(activeOrg.role);
}

export function useCanComment(): boolean {
  const activeOrg = useActiveOrg();
  return !!activeOrg && COMMENT_ROLES.has(activeOrg.role);
}

export function useIsOwner(): boolean {
  const activeOrg = useActiveOrg();
  return activeOrg?.role === 'OWNER';
}
