import apiClient from './apiClient';
import type { SupporterDto, SupporterCreate, SupporterFilters } from '../types/supporter';

export async function getSupporters(filters?: SupporterFilters): Promise<SupporterDto[]> {
  const params: Record<string, string> = {};
  if (filters?.supporterType) params.supporterType = filters.supporterType;
  if (filters?.status) params.status = filters.status;
  if (filters?.search) params.search = filters.search;
  const response = await apiClient.get<SupporterDto[]>('/Supporters', { params });
  return response.data;
}

export async function getSupporter(id: number): Promise<SupporterDto> {
  const response = await apiClient.get<SupporterDto>(`/Supporters/${id}`);
  return response.data;
}

export async function createSupporter(data: SupporterCreate): Promise<SupporterDto> {
  const response = await apiClient.post<SupporterDto>('/Supporters', data);
  return response.data;
}

export async function updateSupporter(id: number, data: SupporterCreate): Promise<void> {
  await apiClient.put(`/Supporters/${id}`, data);
}

export async function deleteSupporter(id: number): Promise<void> {
  await apiClient.delete(`/Supporters/${id}`);
}
