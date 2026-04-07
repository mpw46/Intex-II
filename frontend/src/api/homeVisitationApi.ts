import apiClient from './apiClient';
import type { HomeVisitation, HomeVisitationCreate } from '../types/homeVisitation';
import type { ResidentDto } from '../types/resident';

export async function getVisitations(filters?: Record<string, string>): Promise<HomeVisitation[]> {
  const params = filters ? new URLSearchParams(filters) : undefined;
  const response = await apiClient.get<HomeVisitation[]>('/HomeVisitation', { params });
  return response.data;
}

export async function getVisitation(id: number): Promise<HomeVisitation> {
  const response = await apiClient.get<HomeVisitation>(`/homevisitation/${id}`);
  return response.data;
}

export async function createVisitation(data: HomeVisitationCreate): Promise<HomeVisitation> {
  const response = await apiClient.post<HomeVisitation>('/homevisitation', data);
  return response.data;
}

export async function updateVisitation(id: number, data: HomeVisitationCreate): Promise<void> {
  await apiClient.put(`/homevisitation/${id}`, data);
}

export async function deleteVisitation(id: number): Promise<void> {
  await apiClient.delete(`/homevisitation/${id}`);
}

export async function getResidents(): Promise<ResidentDto[]> {
  const response = await apiClient.get<ResidentDto[]>('/Residents');
  return response.data;
}
