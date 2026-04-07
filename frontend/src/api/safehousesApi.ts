import apiClient from './apiClient';
import type { SafehouseDto, SafehouseCreate } from '../types/safehouse';

export async function getSafehouses(filters?: { status?: string; region?: string }): Promise<SafehouseDto[]> {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.region) params.region = filters.region;
  const response = await apiClient.get<SafehouseDto[]>('/Safehouses', { params });
  return response.data;
}

export async function getSafehouse(id: number): Promise<SafehouseDto> {
  const response = await apiClient.get<SafehouseDto>(`/Safehouses/${id}`);
  return response.data;
}

export async function createSafehouse(data: SafehouseCreate): Promise<SafehouseDto> {
  const response = await apiClient.post<SafehouseDto>('/Safehouses', data);
  return response.data;
}

export async function updateSafehouse(id: number, data: SafehouseCreate): Promise<void> {
  await apiClient.put(`/Safehouses/${id}`, data);
}

export async function deleteSafehouse(id: number): Promise<void> {
  await apiClient.delete(`/Safehouses/${id}`);
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
