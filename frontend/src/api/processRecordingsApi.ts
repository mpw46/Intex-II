import { readApiError } from './authAPI';
import type { ProcessRecordingDto, ProcessRecordingCreate, RecordingFilters } from '../types/processRecording';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getRecordings(filters?: RecordingFilters): Promise<ProcessRecordingDto[]> {
  const params = new URLSearchParams();
  if (filters?.residentId !== undefined) params.set('residentId', String(filters.residentId));
  if (filters?.socialWorker) params.set('socialWorker', filters.socialWorker);
  if (filters?.sessionType) params.set('sessionType', filters.sessionType);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/ProcessRecordings${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load process recordings.'));
  return response.json();
}

export async function getRecording(id: number): Promise<ProcessRecordingDto> {
  const response = await fetch(`${apiBaseUrl}/ProcessRecordings/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load process recording.'));
  return response.json();
}

export async function createRecording(data: ProcessRecordingCreate): Promise<ProcessRecordingDto> {
  const response = await fetch(`${apiBaseUrl}/ProcessRecordings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create process recording.'));
  return response.json();
}

export async function updateRecording(id: number, data: ProcessRecordingCreate): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/ProcessRecordings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to update process recording.'));
}

export async function deleteRecording(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/ProcessRecordings/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete process recording.'));
}
