export type AppUserRole = 'Admin' | 'Donor';

export interface AdminUserListItem {
  id: string;
  userName: string | null;
  email: string | null;
  roles: string[];
  hasPassword: boolean;
}
