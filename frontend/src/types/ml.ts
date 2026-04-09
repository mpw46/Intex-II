export interface MlResidentRiskDto {
  residentId: number;
  caseControlNo: string | null;
  safehouseName: string | null;
  riskProbability: number;
  riskLevel: string;           // 'High' | 'Medium' | 'Low'
  asOfDate: string;
  scoredAt: string;
  modelVersion: string;
}

export interface MlDonorRiskDto {
  supporterId: number;
  displayName: string | null;
  lapseProbability: number;
  riskTier: string;            // 'High' | 'Medium' | 'Low'
  asOfDate: string;
  scoredAt: string;
  modelVersion: string;
}

export interface MlSocialEngagementDriverDto {
  rank: number;
  featureName: string;
  importance: number;
  direction: string | null;    // 'positive' | 'negative' (OLS only)
  modelType: string;           // 'OLS' | 'DecisionTree'
  scoredAt: string;
  modelVersion: string;
}

export interface MlReintegrationDriverDto {
  rank: number;
  featureName: string;
  importance: number;
  direction: string | null;    // 'positive' (faster) | 'negative' (slower) — OLS only; null for Tree
  modelType: string;           // 'OLS' | 'DecisionTree'
  scoredAt: string;
  modelVersion: string;
}
