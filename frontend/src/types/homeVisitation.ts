export interface HomeVisitation {
  visitationId: number;
  residentId: number | null;
  visitDate: string | null;
  socialWorker: string | null;
  visitType: string | null;
  locationVisited: string | null;
  familyMembersPresent: string | null;
  purpose: string | null;
  observations: string | null;
  familyCooperationLevel: string | null;
  safetyConcernsNoted: boolean | null;
  followUpNeeded: boolean | null;
  followUpNotes: string | null;
  visitOutcome: string | null;
}

export interface HomeVisitationCreate {
  residentId: number | null;
  visitDate: string;
  socialWorker: string;
  visitType: string;
  locationVisited?: string;
  familyMembersPresent?: string;
  purpose?: string;
  observations?: string;
  familyCooperationLevel?: string;
  safetyConcernsNoted?: boolean;
  followUpNeeded?: boolean;
  followUpNotes?: string;
  visitOutcome?: string;
}

export const VISIT_TYPES = [
  'Initial Assessment',
  'Routine Follow-Up',
  'Reintegration Assessment',
  'Post-Placement Monitoring',
  'Emergency',
] as const;

export const COOPERATION_LEVELS = [
  'Cooperative',
  'Highly Cooperative',
  'Neutral',
  'Uncooperative',
] as const;

export const VISIT_OUTCOMES = [
  'Favorable',
  'Needs Improvement',
  'Unfavorable',
  'Inconclusive',
] as const;

export interface ResidentLookup {
  residentId: number;
  caseStatus: string | null;
  assignedSocialWorker: string | null;
  safehouseId: number | null;
}
