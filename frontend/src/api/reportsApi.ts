import { readApiError } from './authAPI';
import type { SafehouseMonthlyMetricDto, SocialMediaPostDto, InterventionPlanDto } from '../types/reports';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function getMonthlyMetrics(filters?: { safehouseId?: number; monthStart?: string }): Promise<SafehouseMonthlyMetricDto[]> {
  const params = new URLSearchParams();
  if (filters?.safehouseId !== undefined) params.set('safehouseId', String(filters.safehouseId));
  if (filters?.monthStart) params.set('monthStart', filters.monthStart);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/SafehouseMonthlyMetrics${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load monthly metrics.'));
  return response.json();
}

export async function getSocialMediaPosts(filters?: { platform?: string; limit?: number }): Promise<SocialMediaPostDto[]> {
  const params = new URLSearchParams();
  if (filters?.platform) params.set('platform', filters.platform);
  if (filters?.limit !== undefined) params.set('limit', String(filters.limit));
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/SocialMediaPosts${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load social media posts.'));
  return response.json();
}

export async function getInterventionPlans(filters?: { residentId?: number; status?: string }): Promise<InterventionPlanDto[]> {
  const params = new URLSearchParams();
  if (filters?.residentId !== undefined) params.set('residentId', String(filters.residentId));
  if (filters?.status) params.set('status', filters.status);
  const query = params.toString() ? `?${params}` : '';
  const response = await fetch(`${apiBaseUrl}/InterventionPlans${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error(await readApiError(response, 'Unable to load intervention plans.'));
  return response.json();
}
