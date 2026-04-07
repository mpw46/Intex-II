import apiClient from './apiClient';

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
  const res = await apiClient.get<ImpactSnapshot>('/PublicImpact/snapshot');
  return res.data;
}

export async function getImpactSafehouses(): Promise<SafehouseCard[]> {
  const res = await apiClient.get<SafehouseCard[]>('/PublicImpact/safehouses');
  return res.data;
}

export async function getYearlyOutcomes(): Promise<YearlyOutcome[]> {
  const res = await apiClient.get<YearlyOutcome[]>('/PublicImpact/yearly-outcomes');
  return res.data;
}

export async function getAllocations(): Promise<DonationAllocationSummary[]> {
  const res = await apiClient.get<DonationAllocationSummary[]>('/PublicImpact/allocations');
  return res.data;
}

export async function getProgramOutcomes(): Promise<ProgramOutcomeMetric[]> {
  const res = await apiClient.get<ProgramOutcomeMetric[]>('/PublicImpact/program-outcomes');
  return res.data;
}
