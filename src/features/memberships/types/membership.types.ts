export interface MemberUser {
  id: string;
  name: string;
  email: string;
}

export interface MemberWithUser {
  membership: { id: string; userId: string; role: string };
  user: MemberUser;
}
