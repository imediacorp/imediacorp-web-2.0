/**
 * Comparison API Client
 * API client for cross-domain comparison functionality
 */

import { apiClient } from './client';
import type {
  ComparisonSession,
  ComparisonRequest,
  ComparisonResult,
  DomainId,
  DomainSnapshot,
} from '@/types/comparison';

export const comparisonApi = {
  /**
   * Create a new comparison session
   */
  async createSession(
    name: string,
    domains: DomainId[],
    description?: string
  ): Promise<ComparisonSession> {
    return apiClient.post<ComparisonSession>('/api/v1/comparison/sessions', {
      name,
      domains,
      description,
    });
  },

  /**
   * Get comparison session by ID
   */
  async getSession(sessionId: string): Promise<ComparisonSession> {
    return apiClient.get<ComparisonSession>(`/api/v1/comparison/sessions/${sessionId}`);
  },

  /**
   * List user's comparison sessions
   */
  async listSessions(): Promise<ComparisonSession[]> {
    return apiClient.get<ComparisonSession[]>('/api/v1/comparison/sessions');
  },

  /**
   * Update comparison session
   */
  async updateSession(
    sessionId: string,
    updates: Partial<ComparisonSession>
  ): Promise<ComparisonSession> {
    return apiClient.put<ComparisonSession>(`/api/v1/comparison/sessions/${sessionId}`, updates);
  },

  /**
   * Delete comparison session
   */
  async deleteSession(sessionId: string): Promise<void> {
    return apiClient.delete(`/api/v1/comparison/sessions/${sessionId}`);
  },

  /**
   * Run comparison analysis
   */
  async runComparison(request: ComparisonRequest): Promise<ComparisonResult> {
    return apiClient.post<ComparisonResult>('/api/v1/comparison/analyze', request);
  },

  /**
   * Get domain snapshots for a session
   */
  async getSnapshots(sessionId: string): Promise<DomainSnapshot[]> {
    return apiClient.get<DomainSnapshot[]>(`/api/v1/comparison/sessions/${sessionId}/snapshots`);
  },

  /**
   * Create domain snapshot
   */
  async createSnapshot(
    sessionId: string,
    domain: DomainId,
    squd: {
      S: number;
      Q: number;
      U: number;
      D: number;
    },
    metadata?: Record<string, unknown>
  ): Promise<DomainSnapshot> {
    return apiClient.post<DomainSnapshot>(`/api/v1/comparison/sessions/${sessionId}/snapshots`, {
      domain,
      squd,
      metadata,
    });
  },
};

