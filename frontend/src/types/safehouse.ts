export interface SafehouseDto {
  safehouseId: number | null;
  safehouseCode: string | null;
  name: string | null;
  region: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  openDate: string | null;
  status: string | null;
  capacityGirls: number | null;
  capacityStaff: number | null;
  currentOccupancy: number | null;
  notes: string | null;
}

export interface SafehouseCreate {
  safehouseCode?: string;
  name?: string;
  region?: string;
  city?: string;
  province?: string;
  country?: string;
  openDate?: string;
  status?: string;
  capacityGirls?: number;
  capacityStaff?: number;
  currentOccupancy?: number;
  notes?: string;
}
