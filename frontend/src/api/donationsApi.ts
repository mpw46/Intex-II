import { readApiError } from './authAPI';
import type {
  DonationDto,
  DonationCreate,
  DonationFilters,
  DonationAllocationDto,
  DonationAllocationCreate,
  AllocationFilters,
} from '../types/donation';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getDonations(filters?: DonationFilters): Promise<DonationDto[]> {
  const params = new URLSearchParams();
  if (filters?.supporterId !== undefined) params.set('supporterId', String(filters.supporterId));
  if (filters?.donationType) params.set('donationType', filters.donationType);
  if (filters?.campaignName) params.set('campaignName', filters.campaignName);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/Donations${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load donations.'));
  return response.json();
}

export async function getDonation(id: number): Promise<DonationDto> {
  const response = await fetch(`${apiBaseUrl}/Donations/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load donation.'));
  return response.json();
}

export async function createDonationRecord(data: DonationCreate): Promise<DonationDto> {
  const response = await fetch(`${apiBaseUrl}/Donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create donation.'));
  return response.json();
}

export async function updateDonation(id: number, data: DonationCreate): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Donations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to update donation.'));
}

export async function deleteDonation(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/Donations/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete donation.'));
}

export async function getAllocations(filters?: AllocationFilters): Promise<DonationAllocationDto[]> {
  const params = new URLSearchParams();
  if (filters?.donationId !== undefined) params.set('donationId', String(filters.donationId));
  if (filters?.safehouseId !== undefined) params.set('safehouseId', String(filters.safehouseId));
  if (filters?.programArea) params.set('programArea', filters.programArea);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/DonationAllocations${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load allocations.'));
  return response.json();
}

export async function createAllocation(data: DonationAllocationCreate): Promise<DonationAllocationDto> {
  const response = await fetch(`${apiBaseUrl}/DonationAllocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create allocation.'));
  return response.json();
}

export async function deleteAllocation(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/DonationAllocations/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to delete allocation.'));
}
