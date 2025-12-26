/**
 * Predictive Modeling Types
 * Type definitions for predictive models, forecasts, and predictions
 */

/**
 * Model type
 */
export type ModelType = 'forecast' | 'anomaly' | 'failure' | 'health_score';

/**
 * Model status
 */
export type ModelStatus = 'draft' | 'training' | 'trained' | 'failed' | 'archived';

/**
 * Predictive model configuration
 */
export interface PredictiveModel {
  id: string;
  name: string;
  description?: string;
  domain: string;
  modelType: ModelType;
  modelConfig: ModelConfiguration;
  trainingDataConfig?: TrainingDataConfig;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  trained_at?: string;
}

/**
 * Model configuration (varies by model type)
 */
export interface ModelConfiguration {
  // For forecasting models
  horizon?: number; // Prediction horizon in periods
  seasonality?: boolean;
  trend?: boolean;
  
  // For anomaly detection
  threshold?: number;
  contamination?: number; // Expected proportion of anomalies
  
  // For failure prediction
  timeToFailure?: boolean;
  classificationThreshold?: number;
  
  // Common parameters
  algorithm?: string; // e.g., 'ARIMA', 'Prophet', 'LSTM', 'IsolationForest'
  parameters?: Record<string, unknown>;
}

/**
 * Training data configuration
 */
export interface TrainingDataConfig {
  source: 'upload' | 'domain' | 'api';
  timeRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, unknown>;
  features?: string[];
  target?: string;
}

/**
 * Prediction result
 */
export interface Prediction {
  id: string;
  modelId: string;
  timestamp: string;
  predictedValue: number;
  confidenceIntervalLower?: number;
  confidenceIntervalUpper?: number;
  actualValue?: number; // For evaluation
  metadata?: Record<string, unknown>;
}

/**
 * Forecast data point
 */
export interface ForecastPoint {
  timestamp: string;
  value: number;
  lower: number;
  upper: number;
  confidence: number; // 0-1
}

/**
 * Forecast result
 */
export interface ForecastResult {
  modelId: string;
  points: ForecastPoint[];
  metrics?: ModelMetrics;
}

/**
 * Model performance metrics
 */
export interface ModelMetrics {
  accuracy?: number;
  rmse?: number;
  mae?: number;
  mape?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  auc?: number;
  [key: string]: number | undefined;
}

/**
 * Anomaly detection result
 */
export interface AnomalyResult {
  timestamp: string;
  value: number;
  isAnomaly: boolean;
  anomalyScore: number;
  threshold: number;
}

/**
 * Model evaluation result
 */
export interface ModelEvaluation {
  modelId: string;
  metrics: ModelMetrics;
  evaluationData?: {
    predictions: number[];
    actuals: number[];
    residuals?: number[];
  };
  computed_at: string;
}

/**
 * Predictive model request
 */
export interface PredictiveModelRequest {
  name: string;
  description?: string;
  domain: string;
  modelType: ModelType;
  modelConfig: ModelConfiguration;
  trainingDataConfig?: TrainingDataConfig;
}

/**
 * Prediction request
 */
export interface PredictionRequest {
  modelId: string;
  data?: Record<string, unknown>;
  horizon?: number;
}

