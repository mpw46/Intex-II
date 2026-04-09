import { readApiError } from './authAPI';
import type { AdminUserListItem, AppUserRole } from '../types/adminUser';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getAdminUsers(): Promise<AdminUserListItem[]> {
  const response = await fetch(`${apiBaseUrl}/AdminUsers`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load users.'));
  return response.json();
}

export async function updateAdminUserRole(userId: string, role: AppUserRole): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/AdminUsers/${encodeURIComponent(userId)}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role }),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to update role.'));
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/AdminUsers/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete user.'));
}
