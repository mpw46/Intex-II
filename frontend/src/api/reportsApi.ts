import apiClient from './apiClient';
import type { SafehouseMonthlyMetricDto, SocialMediaPostDto, InterventionPlanDto } from '../types/reports';

export async function getMonthlyMetrics(filters?: { safehouseId?: number; monthStart?: string }): Promise<SafehouseMonthlyMetricDto[]> {
  const params: Record<string, string> = {};
  if (filters?.safehouseId !== undefined) params.safehouseId = String(filters.safehouseId);
  if (filters?.monthStart) params.monthStart = filters.monthStart;
  const response = await apiClient.get<SafehouseMonthlyMetricDto[]>('/SafehouseMonthlyMetrics', { params });
  return response.data;
}

export async function getSocialMediaPosts(filters?: { platform?: string; limit?: number }): Promise<SocialMediaPostDto[]> {
  const params: Record<string, string> = {};
  if (filters?.platform) params.platform = filters.platform;
  if (filters?.limit !== undefined) params.limit = String(filters.limit);
  const response = await apiClient.get<SocialMediaPostDto[]>('/SocialMediaPosts', { params });
  return response.data;
}

export async function getInterventionPlans(filters?: { residentId?: number; status?: string }): Promise<InterventionPlanDto[]> {
  const params: Record<string, string> = {};
  if (filters?.residentId !== undefined) params.residentId = String(filters.residentId);
  if (filters?.status) params.status = filters.status;
  const response = await apiClient.get<InterventionPlanDto[]>('/InterventionPlans', { params });
  return response.data;
}
