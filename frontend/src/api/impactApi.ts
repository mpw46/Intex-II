const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export interface ImpactSnapshot {
  totalGirlsServed: number;
  activeResidents: number;
  reintegrationSuccessRate: number;
  yearsOfOperation: number;
  activeSafehouses: number;
  philippineRegionsCovered: number;
  reportingPeriod: string;
}

export interface SafehouseCard {
  id: number;
  name: string;
  region: string;
  city: string;
  province: string;
  status: string;
  capacityGirls: number;
  currentOccupancy: number;
  reintegrationRatePercent: number;
  avgProgressPercent: number;
}

export interface DonationAllocationSummary {
  programArea: string;
  percentOfFunds: number;
  description: string;
}

export interface YearlyOutcome {
  year: number;
  girlsAdmitted: number;
  girlsReintegrated: number;
}

export interface ProgramOutcomeMetric {
  label: string;
  completionRate: number;
  description: string;
}

export async function getImpactSnapshot(): Promise<ImpactSnapshot> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/snapshot`);
  if (!response.ok) throw new Error('Unable to load impact snapshot.');
  return response.json();
}

export async function getImpactSafehouses(): Promise<SafehouseCard[]> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/safehouses`);
  if (!response.ok) throw new Error('Unable to load safehouse impact data.');
  return response.json();
}

export async function getYearlyOutcomes(): Promise<YearlyOutcome[]> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/yearly-outcomes`);
  if (!response.ok) throw new Error('Unable to load yearly outcomes.');
  return response.json();
}

export async function getAllocations(): Promise<DonationAllocationSummary[]> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/allocations`);
  if (!response.ok) throw new Error('Unable to load donation allocations.');
  return response.json();
}

export async function getProgramOutcomes(): Promise<ProgramOutcomeMetric[]> {
  const response = await fetch(`${apiBaseUrl}/PublicImpact/program-outcomes`);
  if (!response.ok) throw new Error('Unable to load program outcomes.');
  return response.json();
}
