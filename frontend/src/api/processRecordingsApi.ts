import apiClient from './apiClient';
import type { ProcessRecordingDto, ProcessRecordingCreate, RecordingFilters } from '../types/processRecording';

export async function getRecordings(filters?: RecordingFilters): Promise<ProcessRecordingDto[]> {
  const params: Record<string, string> = {};
  if (filters?.residentId !== undefined) params.residentId = String(filters.residentId);
  if (filters?.socialWorker) params.socialWorker = filters.socialWorker;
  if (filters?.sessionType) params.sessionType = filters.sessionType;
  const response = await apiClient.get<ProcessRecordingDto[]>('/ProcessRecordings', { params });
  return response.data;
}

export async function getRecording(id: number): Promise<ProcessRecordingDto> {
  const response = await apiClient.get<ProcessRecordingDto>(`/ProcessRecordings/${id}`);
  return response.data;
}

export async function createRecording(data: ProcessRecordingCreate): Promise<ProcessRecordingDto> {
  const response = await apiClient.post<ProcessRecordingDto>('/ProcessRecordings', data);
  return response.data;
}

export async function updateRecording(id: number, data: ProcessRecordingCreate): Promise<void> {
  await apiClient.put(`/ProcessRecordings/${id}`, data);
}

export async function deleteRecording(id: number): Promise<void> {
  await apiClient.delete(`/ProcessRecordings/${id}`);
}
