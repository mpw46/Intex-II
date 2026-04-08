import { readApiError } from './authAPI';
import type { ResidentDto, ResidentCreate, ResidentFilters } from '../types/resident';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getResidents(filters?: ResidentFilters): Promise<ResidentDto[]> {
  const params = new URLSearchParams();
  if (filters?.safehouseId !== undefined) params.set('safehouseId', String(filters.safehouseId));
  if (filters?.caseStatus) params.set('caseStatus', filters.caseStatus);
  if (filters?.riskLevel) params.set('riskLevel', filters.riskLevel);
  if (filters?.socialWorker) params.set('socialWorker', filters.socialWorker);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/Residents${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load residents.'));
  return response.json();
}

export async function getResident(id: number): Promise<ResidentDto> {
  const response = await fetch(`${apiBaseUrl}/Residents/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load resident.'));
  return response.json();
}

export async function createResident(data: ResidentCreate): Promise<ResidentDto> {
  const response = await fetch(`${apiBaseUrl}/Residents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create resident.'));
  return response.json();
}

export async function updateResident(id: number, data: ResidentCreate): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Residents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to update resident.'));
}

export async function deleteResident(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Residents/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete resident.'));
}
