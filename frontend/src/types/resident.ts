export interface ResidentDto {
  residentId: number | null;
  caseControlNo: string | null;
  internalCode: string | null;
  safehouseId: number | null;
  caseStatus: string | null;
  sex: string | null;
  dateOfBirth: string | null;
  birthStatus: string | null;
  placeOfBirth: string | null;
  religion: string | null;
  caseCategory: string | null;
  subCatOrphaned: string | null;
  subCatTrafficked: string | null;
  subCatChildLabor: string | null;
  subCatPhysicalAbuse: string | null;
  subCatSexualAbuse: string | null;
  subCatOsaec: string | null;
  subCatCicl: string | null;
  subCatAtRisk: string | null;
  subCatStreetChild: string | null;
  subCatChildWithHiv: string | null;
  isPwd: string | null;
  pwdType: string | null;
  hasSpecialNeeds: string | null;
  specialNeedsDiagnosis: string | null;
  familyIs4ps: string | null;
  familySoloParent: string | null;
  familyIndigenous: string | null;
  familyParentPwd: string | null;
  familyInformalSettler: string | null;
  dateOfAdmission: string | null;
  ageUponAdmission: string | null;
  presentAge: string | null;
  lengthOfStay: string | null;
  referralSource: string | null;
  referringAgencyPerson: string | null;
  dateColbRegistered: string | null;
  dateColbObtained: string | null;
  assignedSocialWorker: string | null;
  initialCaseAssessment: string | null;
  dateCaseStudyPrepared: string | null;
  reintegrationType: string | null;
  reintegrationStatus: string | null;
  initialRiskLevel: string | null;
  currentRiskLevel: string | null;
  dateEnrolled: string | null;
  dateClosed: string | null;
  createdAt: string | null;
  notesRestricted: string | null;
}

export interface ResidentCreate {
  caseControlNo?: string;
  internalCode?: string;
  safehouseId?: number;
  caseStatus?: string;
  sex?: string;
  dateOfBirth?: string;
  birthStatus?: string;
  placeOfBirth?: string;
  religion?: string;
  caseCategory?: string;
  subCatOrphaned?: string;
  subCatTrafficked?: string;
  subCatChildLabor?: string;
  subCatPhysicalAbuse?: string;
  subCatSexualAbuse?: string;
  subCatOsaec?: string;
  subCatCicl?: string;
  subCatAtRisk?: string;
  subCatStreetChild?: string;
  subCatChildWithHiv?: string;
  isPwd?: string;
  pwdType?: string;
  hasSpecialNeeds?: string;
  specialNeedsDiagnosis?: string;
  familyIs4ps?: string;
  familySoloParent?: string;
  familyIndigenous?: string;
  familyParentPwd?: string;
  familyInformalSettler?: string;
  dateOfAdmission?: string;
  ageUponAdmission?: string;
  referralSource?: string;
  referringAgencyPerson?: string;
  assignedSocialWorker?: string;
  initialCaseAssessment?: string;
  reintegrationType?: string;
  reintegrationStatus?: string;
  initialRiskLevel?: string;
  currentRiskLevel?: string;
}

export interface ResidentFilters {
  safehouseId?: number;
  caseStatus?: string;
  riskLevel?: string;
  socialWorker?: string;
}

/** Normalize 'Yes'/'No'/'True'/'False' strings from backend to boolean */
export function isTruthy(v: string | null | undefined): boolean {
  return v === 'Yes' || v === 'True' || v === 'true' || v === '1';
}
