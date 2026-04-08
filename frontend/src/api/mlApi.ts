import apiClient from './apiClient';
import type { MlResidentRiskDto, MlDonorRiskDto, MlSocialEngagementDriverDto } from '../types/ml';

export async function getMlResidentRisk(riskLevel?: string): Promise<MlResidentRiskDto[]> {
  const params: Record<string, string> = {};
  if (riskLevel) params.riskLevel = riskLevel;
  const response = await apiClient.get<MlResidentRiskDto[]>('/MlResidentRisk', { params });
  return response.data;
}

export async function getMlDonorRisk(riskTier?: string): Promise<MlDonorRiskDto[]> {
  const params: Record<string, string> = {};
  if (riskTier) params.riskTier = riskTier;
  const response = await apiClient.get<MlDonorRiskDto[]>('/MlDonorRisk', { params });
  return response.data;
}

export async function getMlSocialEngagement(modelType = 'OLS'): Promise<MlSocialEngagementDriverDto[]> {
  const response = await apiClient.get<MlSocialEngagementDriverDto[]>('/MlSocialEngagement', {
    params: { modelType },
  });
  return response.data;
}
