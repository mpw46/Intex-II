import apiClient from './apiClient';
import type {
  DonationDto,
  DonationCreate,
  DonationFilters,
  DonationAllocationDto,
  DonationAllocationCreate,
  AllocationFilters,
} from '../types/donation';

export async function getDonations(filters?: DonationFilters): Promise<DonationDto[]> {
  const params: Record<string, string> = {};
  if (filters?.supporterId !== undefined) params.supporterId = String(filters.supporterId);
  if (filters?.donationType) params.donationType = filters.donationType;
  if (filters?.campaignName) params.campaignName = filters.campaignName;
  const response = await apiClient.get<DonationDto[]>('/Donations', { params });
  return response.data;
}

export async function getDonation(id: number): Promise<DonationDto> {
  const response = await apiClient.get<DonationDto>(`/Donations/${id}`);
  return response.data;
}

export async function createDonationRecord(data: DonationCreate): Promise<DonationDto> {
  const response = await apiClient.post<DonationDto>('/Donations', data);
  return response.data;
}

export async function updateDonation(id: number, data: DonationCreate): Promise<void> {
  await apiClient.put(`/Donations/${id}`, data);
}

export async function deleteDonation(id: number): Promise<void> {
  await apiClient.delete(`/Donations/${id}`);
}

export async function getAllocations(filters?: AllocationFilters): Promise<DonationAllocationDto[]> {
  const params: Record<string, string> = {};
  if (filters?.donationId !== undefined) params.donationId = String(filters.donationId);
  if (filters?.safehouseId !== undefined) params.safehouseId = String(filters.safehouseId);
  if (filters?.programArea) params.programArea = filters.programArea;
  const response = await apiClient.get<DonationAllocationDto[]>('/DonationAllocations', { params });
  return response.data;
}

export async function createAllocation(data: DonationAllocationCreate): Promise<DonationAllocationDto> {
  const response = await apiClient.post<DonationAllocationDto>('/DonationAllocations', data);
  return response.data;
}

export async function deleteAllocation(id: number): Promise<void> {
  await apiClient.delete(`/DonationAllocations/${id}`);
}
