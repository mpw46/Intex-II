export interface DonationDto {
  donationId: number | null;
  supporterId: number | null;
  donationType: string | null;
  donationDate: string | null;
  isRecurring: string | null;
  campaignName: string | null;
  channelSource: string | null;
  currencyCode: string | null;
  amount: string | null;
  estimatedValue: number | null;
  impactUnit: string | null;
  notes: string | null;
  referralPostId: string | null;
}

export interface DonationCreate {
  supporterId?: number;
  donationType?: string;
  donationDate?: string;
  isRecurring?: string;
  campaignName?: string;
  channelSource?: string;
  currencyCode?: string;
  amount?: string;
  estimatedValue?: number;
  impactUnit?: string;
  notes?: string;
}

export interface DonationFilters {
  supporterId?: number;
  donationType?: string;
  campaignName?: string;
}

export interface DonationAllocationDto {
  allocationId: number | null;
  donationId: number | null;
  safehouseId: number | null;
  programArea: string | null;
  amountAllocated: number | null;
  allocationDate: string | null;
  allocationNotes: string | null;
}

export interface DonationAllocationCreate {
  donationId?: number;
  safehouseId?: number;
  programArea?: string;
  amountAllocated?: number;
  allocationDate?: string;
  allocationNotes?: string;
}

export interface AllocationFilters {
  donationId?: number;
  safehouseId?: number;
  programArea?: string;
}
