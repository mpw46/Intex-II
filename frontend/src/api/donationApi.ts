import { readApiError } from './authAPI';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export interface SafehouseOption {
  safehouseId: number;
  name: string;
  region: string;
}

export interface DonationCreate {
  supporterId?: number;
  donationType: string;
  donationDate: string;
  isRecurring: string;
  campaignName?: string;
  channelSource: string;
  currencyCode: string;
  amount?: string;
  estimatedValue?: number;
  notes?: string;
}

export interface DonationResponse {
  donationId: number;
  supporterId?: number;
  donationType: string;
  amount?: string;
}

export interface DonationAllocationCreate {
  donationId: number;
  safehouseId?: number;
  programArea: string;
  amountAllocated?: number;
  allocationDate: string;
}

export async function getSafehouses(): Promise<SafehouseOption[]> {
  const response = await fetch(`${apiBaseUrl}/Safehouses`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load safehouses.'));
  return response.json();
}

export async function createDonation(data: DonationCreate): Promise<DonationResponse> {
  const response = await fetch(`${apiBaseUrl}/Donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create donation.'));
  return response.json();
}

export async function createDonationAllocation(data: DonationAllocationCreate): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/DonationAllocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to create donation allocation.'));
}
