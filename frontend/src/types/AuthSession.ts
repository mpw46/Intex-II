export interface AuthSession {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  email: string | null;
  roles: string[];
}