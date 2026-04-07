import apiClient from './apiClient';
import type { ResidentDto, ResidentCreate, ResidentFilters } from '../types/resident';

export async function getResidents(filters?: ResidentFilters): Promise<ResidentDto[]> {
  const params: Record<string, string> = {};
  if (filters?.safehouseId !== undefined) params.safehouseId = String(filters.safehouseId);
  if (filters?.caseStatus) params.caseStatus = filters.caseStatus;
  if (filters?.riskLevel) params.riskLevel = filters.riskLevel;
  if (filters?.socialWorker) params.socialWorker = filters.socialWorker;
  const response = await apiClient.get<ResidentDto[]>('/Residents', { params });
  return response.data;
}

export async function getResident(id: number): Promise<ResidentDto> {
  const response = await apiClient.get<ResidentDto>(`/Residents/${id}`);
  return response.data;
}

export async function createResident(data: ResidentCreate): Promise<ResidentDto> {
  const response = await apiClient.post<ResidentDto>('/Residents', data);
  return response.data;
}

export async function updateResident(id: number, data: ResidentCreate): Promise<void> {
  await apiClient.put(`/Residents/${id}`, data);
}

export async function deleteResident(id: number): Promise<void> {
  await apiClient.delete(`/Residents/${id}`);
}
