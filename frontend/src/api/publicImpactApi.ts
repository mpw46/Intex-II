import type { ImpactSnapshotDto, AllocationSummaryDto } from '../types/publicImpact';

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
