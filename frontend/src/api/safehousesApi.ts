import { readApiError } from './authAPI';
import type { SafehouseDto, SafehouseCreate } from '../types/safehouse';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getSafehouses(filters?: { status?: string; region?: string }): Promise<SafehouseDto[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.region) params.set('region', filters.region);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/Safehouses${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load safehouses.'));
  return response.json();
}

export async function getSafehouse(id: number): Promise<SafehouseDto> {
  const response = await fetch(`${apiBaseUrl}/Safehouses/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load safehouse.'));
  return response.json();
}

export async function createSafehouse(data: SafehouseCreate): Promise<SafehouseDto> {
  const response = await fetch(`${apiBaseUrl}/Safehouses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create safehouse.'));
  return response.json();
}

export async function updateSafehouse(id: number, data: SafehouseCreate): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Safehouses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to update safehouse.'));
}

export async function deleteSafehouse(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Safehouses/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete safehouse.'));
}

/** Build a Map<safehouseId, name> for fast lookups in UI components */
export function buildSafehouseNameMap(safehouses: SafehouseDto[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const sh of safehouses) {
    if (sh.safehouseId != null && sh.name) {
      map.set(sh.safehouseId, sh.name);
    }
  }
  return map;
}
