import { readApiError } from './authAPI';
import type { MlResidentRiskDto, MlDonorRiskDto, MlSocialEngagementDriverDto, MlReintegrationDriverDto } from '../types/ml';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getMlResidentRisk(riskLevel?: string): Promise<MlResidentRiskDto[]> {
  const params = new URLSearchParams();
  if (riskLevel) params.set('riskLevel', riskLevel);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/MlResidentRisk${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load resident risk data.'));
  return response.json();
}

export async function getMlDonorRisk(riskTier?: string): Promise<MlDonorRiskDto[]> {
  const params = new URLSearchParams();
  if (riskTier) params.set('riskTier', riskTier);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/MlDonorRisk${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load donor risk data.'));
  return response.json();
}

export async function getMlSocialEngagement(modelType = 'OLS'): Promise<MlSocialEngagementDriverDto[]> {
  const params = new URLSearchParams({ modelType });
  const response = await fetch(`${apiBaseUrl}/MlSocialEngagement?${params}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load social engagement data.'));
  return response.json();
}

export async function getMlReintegrationDrivers(modelType = 'OLS'): Promise<MlReintegrationDriverDto[]> {
  const params = new URLSearchParams({ modelType });
  const response = await fetch(`${apiBaseUrl}/MlReintegrationDriver?${params}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load reintegration driver data.'));
  return response.json();
}
