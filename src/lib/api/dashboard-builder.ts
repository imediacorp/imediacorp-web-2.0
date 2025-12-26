/**
 * Dashboard Builder API Client
 * API client for custom dashboard builder functionality
 */

import { apiClient } from './client';
import type {
  CustomDashboard,
  DashboardLayout,
  DashboardComponent,
  DashboardShare,
} from '@/types/dashboard-builder';

export const dashboardBuilderApi = {
  /**
   * Create a new custom dashboard
   */
  async createDashboard(
    name: string,
    layout: DashboardLayout,
    description?: string,
    isPublic = false
  ): Promise<CustomDashboard> {
    return apiClient.post<CustomDashboard>('/api/v1/dashboards/custom', {
      name,
      layout,
      description,
      is_public: isPublic,
    });
  },

  /**
   * Get dashboard by ID
   */
  async getDashboard(dashboardId: string): Promise<CustomDashboard> {
    return apiClient.get<CustomDashboard>(`/api/v1/dashboards/custom/${dashboardId}`);
  },

  /**
   * List user's dashboards
   */
  async listDashboards(includePublic = false): Promise<CustomDashboard[]> {
    const params: Record<string, string> = {};
    if (includePublic) params.include_public = 'true';
    return apiClient.get<CustomDashboard[]>('/api/v1/dashboards/custom', params);
  },

  /**
   * Update dashboard
   */
  async updateDashboard(
    dashboardId: string,
    updates: Partial<CustomDashboard>
  ): Promise<CustomDashboard> {
    return apiClient.put<CustomDashboard>(`/api/v1/dashboards/custom/${dashboardId}`, updates);
  },

  /**
   * Delete dashboard
   */
  async deleteDashboard(dashboardId: string): Promise<void> {
    return apiClient.delete(`/api/v1/dashboards/custom/${dashboardId}`);
  },

  /**
   * Get available components
   */
  async getComponents(): Promise<DashboardComponent[]> {
    return apiClient.get<DashboardComponent[]>('/api/v1/dashboards/components');
  },

  /**
   * Get component by type
   */
  async getComponent(componentType: string): Promise<DashboardComponent> {
    return apiClient.get<DashboardComponent>(`/api/v1/dashboards/components/${componentType}`);
  },

  /**
   * Share dashboard
   */
  async shareDashboard(
    dashboardId: string,
    sharedWithUserId?: string,
    sharedWithEmail?: string,
    permission: 'view' | 'edit' = 'view'
  ): Promise<DashboardShare> {
    return apiClient.post<DashboardShare>(`/api/v1/dashboards/custom/${dashboardId}/share`, {
      shared_with_user_id: sharedWithUserId,
      shared_with_email: sharedWithEmail,
      permission,
    });
  },

  /**
   * List dashboard shares
   */
  async listShares(dashboardId: string): Promise<DashboardShare[]> {
    return apiClient.get<DashboardShare[]>(`/api/v1/dashboards/custom/${dashboardId}/shares`);
  },

  /**
   * Remove dashboard share
   */
  async removeShare(dashboardId: string, shareId: string): Promise<void> {
    return apiClient.delete(`/api/v1/dashboards/custom/${dashboardId}/shares/${shareId}`);
  },
};

