import apiClient from './apiClient';

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
  const res = await apiClient.get('/Safehouses');
  return res.data;
}

export async function createDonation(data: DonationCreate): Promise<DonationResponse> {
  const res = await apiClient.post<DonationResponse>('/Donations', data);
  return res.data;
}

export async function createDonationAllocation(data: DonationAllocationCreate): Promise<void> {
  await apiClient.post('/DonationAllocations', data);
}
