import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OrgOption {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface OrgStore {
  activeOrgId: string | null;
  organizations: OrgOption[];
  setActiveOrg: (id: string) => void;
  setOrganizations: (orgs: OrgOption[]) => void;
  clearOrg: () => void;
}

// Solo persistimos `activeOrgId` (referencia opaca, no revela nada útil).
// La lista de `organizations` se refetchea en cada sesión para:
//   1) evitar exponer la topología del usuario ante XSS (ver docs/security-audit.md M10)
//   2) mantenerla sincronizada con permisos que hayan cambiado desde el último login
export const useOrgStore = create<OrgStore>()(
  persist(
    (set) => ({
      activeOrgId: null,
      organizations: [],
      setActiveOrg: (id) => set({ activeOrgId: id }),
      setOrganizations: (organizations) => set({ organizations }),
      clearOrg: () => set({ activeOrgId: null, organizations: [] }),
    }),
    {
      name: 'aduvanta-org',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeOrgId: state.activeOrgId }),
    },
  ),
);
