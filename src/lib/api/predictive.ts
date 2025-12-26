/**
 * Predictive API Client
 * API client for predictive modeling functionality
 */

import { apiClient } from './client';
import type {
  PredictiveModel,
  PredictiveModelRequest,
  PredictionRequest,
  Prediction,
  ForecastResult,
  ModelEvaluation,
  AnomalyResult,
} from '@/types/predictive';

export const predictiveApi = {
  /**
   * Create a new predictive model
   */
  async createModel(request: PredictiveModelRequest): Promise<PredictiveModel> {
    return apiClient.post<PredictiveModel>('/api/v1/predictive/models', request);
  },

  /**
   * Get model by ID
   */
  async getModel(modelId: string): Promise<PredictiveModel> {
    return apiClient.get<PredictiveModel>(`/api/v1/predictive/models/${modelId}`);
  },

  /**
   * List user's models
   */
  async listModels(domain?: string, modelType?: string): Promise<PredictiveModel[]> {
    const params: Record<string, string> = {};
    if (domain) params.domain = domain;
    if (modelType) params.model_type = modelType;
    return apiClient.get<PredictiveModel[]>('/api/v1/predictive/models', params);
  },

  /**
   * Update model
   */
  async updateModel(
    modelId: string,
    updates: Partial<PredictiveModel>
  ): Promise<PredictiveModel> {
    return apiClient.put<PredictiveModel>(`/api/v1/predictive/models/${modelId}`, updates);
  },

  /**
   * Delete model
   */
  async deleteModel(modelId: string): Promise<void> {
    return apiClient.delete(`/api/v1/predictive/models/${modelId}`);
  },

  /**
   * Train model
   */
  async trainModel(modelId: string): Promise<PredictiveModel> {
    return apiClient.post<PredictiveModel>(`/api/v1/predictive/models/${modelId}/train`, {});
  },

  /**
   * Get model status
   */
  async getModelStatus(modelId: string): Promise<{ status: string; progress?: number }> {
    return apiClient.get<{ status: string; progress?: number }>(
      `/api/v1/predictive/models/${modelId}/status`
    );
  },

  /**
   * Generate predictions
   */
  async predict(request: PredictionRequest): Promise<Prediction[]> {
    return apiClient.post<Prediction[]>('/api/v1/predictive/predict', request);
  },

  /**
   * Generate forecast
   */
  async forecast(modelId: string, horizon?: number): Promise<ForecastResult> {
    const params: Record<string, string> = {};
    if (horizon) params.horizon = horizon.toString();
    return apiClient.post<ForecastResult>(`/api/v1/predictive/models/${modelId}/forecast`, {
      horizon,
    });
  },

  /**
   * Detect anomalies
   */
  async detectAnomalies(
    modelId: string,
    data: Array<{ timestamp: string; value: number }>
  ): Promise<AnomalyResult[]> {
    return apiClient.post<AnomalyResult[]>(`/api/v1/predictive/models/${modelId}/anomalies`, {
      data,
    });
  },

  /**
   * Evaluate model
   */
  async evaluateModel(modelId: string): Promise<ModelEvaluation> {
    return apiClient.post<ModelEvaluation>(`/api/v1/predictive/models/${modelId}/evaluate`, {});
  },

  /**
   * Get model metrics
   */
  async getModelMetrics(modelId: string): Promise<Record<string, number>> {
    return apiClient.get<Record<string, number>>(`/api/v1/predictive/models/${modelId}/metrics`);
  },
};

