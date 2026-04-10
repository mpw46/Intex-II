import type { ImpactSnapshotDto, AllocationSummaryDto, DonationImpactRateDto } from '../types/publicImpact';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getImpactSnapshot(): Promise<ImpactSnapshotDto> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/snapshot`);
  if (!response.ok) throw new Error('Unable to load impact snapshot.');
  return response.json() as Promise<ImpactSnapshotDto>;
}

export async function getImpactAllocations(): Promise<AllocationSummaryDto[]> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/allocations`);
  if (!response.ok) throw new Error('Unable to load allocations.');
  return response.json() as Promise<AllocationSummaryDto[]>;
}

export async function getDonationImpactRates(): Promise<DonationImpactRateDto[]> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/donation-rates`);
  if (!response.ok) throw new Error('Unable to load donation impact rates.');
  return response.json() as Promise<DonationImpactRateDto[]>;
}
