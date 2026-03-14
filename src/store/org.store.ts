import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useOrgStore = create<OrgStore>()(
  persist(
    (set) => ({
      activeOrgId: null,
      organizations: [],
      setActiveOrg: (id) => set({ activeOrgId: id }),
      setOrganizations: (organizations) => set({ organizations }),
      clearOrg: () => set({ activeOrgId: null, organizations: [] }),
    }),
    { name: 'aduvanta-org' },
  ),
);
