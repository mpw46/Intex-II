export interface ImpactSnapshotDto {
  totalGirlsServed: number;
  activeResidents: number;
  reintegrationSuccessRate: number;
  yearsOfOperation: number;
  activeSafehouses: number;
  philippineRegionsCovered: number;
  reportingPeriod: string;
}

export interface AllocationSummaryDto {
  programArea: string;
  percentOfFunds: number;
  description: string;
}

export interface DonationImpactRateDto {
  impactCategory: string;
  costPerUnit: number;
  unitLabel: string;
}
