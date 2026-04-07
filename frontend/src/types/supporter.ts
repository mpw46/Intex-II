export interface SupporterDto {
  supporterId: number | null;
  supporterType: string | null;
  displayName: string | null;
  organizationName: string | null;
  firstName: string | null;
  lastName: string | null;
  relationshipType: string | null;
  region: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  createdAt: string | null;
  firstDonationDate: string | null;
  acquisitionChannel: string | null;
}

export interface SupporterCreate {
  supporterType?: string;
  displayName?: string;
  organizationName?: string;
  firstName?: string;
  lastName?: string;
  relationshipType?: string;
  region?: string;
  country?: string;
  email?: string;
  phone?: string;
  status?: string;
  acquisitionChannel?: string;
}

export interface SupporterFilters {
  supporterType?: string;
  status?: string;
  search?: string;
}
