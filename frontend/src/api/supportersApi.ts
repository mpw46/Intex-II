import { readApiError } from './authAPI';
import type { SupporterDto, SupporterCreate, SupporterFilters } from '../types/supporter';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getSupporters(filters?: SupporterFilters): Promise<SupporterDto[]> {
  const params = new URLSearchParams();
  if (filters?.supporterType) params.set('supporterType', filters.supporterType);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.search) params.set('search', filters.search);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/Supporters${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load supporters.'));
  return response.json();
}

export async function getSupporter(id: number): Promise<SupporterDto> {
  const response = await fetch(`${apiBaseUrl}/Supporters/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load supporter.'));
  return response.json();
}

export async function createSupporter(data: SupporterCreate): Promise<SupporterDto> {
  const response = await fetch(`${apiBaseUrl}/Supporters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create supporter.'));
  return response.json();
}

export async function updateSupporter(id: number, data: SupporterCreate): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Supporters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to update supporter.'));
}

export async function deleteSupporter(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Supporters/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete supporter.'));
}
