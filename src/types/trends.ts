/**
 * Trend Analysis Types
 * Type definitions for historical trend analysis and time-series metrics
 */

/**
 * Trend direction
 */
export type TrendDirection = 'increasing' | 'decreasing' | 'stable';

/**
 * Trend data for a single metric
 */
export interface TrendData {
  metric: string;
  slope: number;
  trend: TrendDirection;
  warning?: boolean;
  rSquared?: number;
  pValue?: number;
}

/**
 * Moving average type
 */
export type MovingAverageType = 'SMA' | 'EMA';

/**
 * Moving average configuration
 */
export interface MovingAverageConfig {
  type: MovingAverageType;
  window: number; // Number of periods
}

/**
 * Trend metrics summary
 */
export interface TrendMetrics {
  metric: string;
  currentValue: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
  rateOfChange: number; // Per period
  trend: TrendDirection;
  trendStrength: number; // 0-1, how strong the trend is
  volatility: number; // Standard deviation
  seasonality?: {
    detected: boolean;
    period?: number;
    strength?: number;
  };
}

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  timestamp: string | Date;
  value: number;
  [key: string]: string | Date | number | undefined;
}

/**
 * Trend analysis request
 */
export interface TrendAnalysisRequest {
  data: TimeSeriesPoint[];
  metrics: string[];
  windowSize?: number;
  movingAverage?: MovingAverageConfig;
  includeSeasonality?: boolean;
}

/**
 * Trend analysis result
 */
export interface TrendAnalysisResult {
  trends: TrendData[];
  metrics: TrendMetrics[];
  movingAverages?: Record<string, number[]>;
  seasonality?: Record<string, {
    detected: boolean;
    period?: number;
    components?: {
      trend: number[];
      seasonal: number[];
      residual: number[];
    };
  }>;
  alerts?: TrendAlert[];
}

/**
 * Trend alert
 */
export interface TrendAlert {
  metric: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold?: number;
  currentValue?: number;
}

/**
 * Regression line data
 */
export interface RegressionLine {
  slope: number;
  intercept: number;
  points: Array<{ x: number; y: number }>;
  rSquared: number;
}

