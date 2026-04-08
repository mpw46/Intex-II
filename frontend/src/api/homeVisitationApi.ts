import { readApiError } from './authAPI';
import type { HomeVisitation, HomeVisitationCreate } from '../types/homeVisitation';
import type { ResidentDto } from '../types/resident';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getVisitations(filters?: Record<string, string>): Promise<HomeVisitation[]> {
  const params = filters ? new URLSearchParams(filters) : new URLSearchParams();
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/HomeVisitation${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load visitations.'));
  return response.json();
}

export async function getVisitation(id: number): Promise<HomeVisitation> {
  const response = await fetch(`${apiBaseUrl}/HomeVisitation/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load visitation.'));
  return response.json();
}

export async function createVisitation(data: HomeVisitationCreate): Promise<HomeVisitation> {
  const response = await fetch(`${apiBaseUrl}/HomeVisitation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create visitation.'));
  return response.json();
}

export async function updateVisitation(id: number, data: HomeVisitationCreate): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/HomeVisitation/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to update visitation.'));
}

export async function deleteVisitation(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/HomeVisitation/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete visitation.'));
}

export async function getResidents(): Promise<ResidentDto[]> {
  const response = await fetch(`${apiBaseUrl}/Residents`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load residents.'));
  return response.json();
}
