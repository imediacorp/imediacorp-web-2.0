/**
 * API Type Definitions
 * Shared types for API requests and responses
 */

export interface SQUDScore {
  S: number; // Stability [0,1]
  Q: number; // Coherence/Quality Pressure [0,1]
  U: number; // Susceptibility/Effort [0,1]
  D: number; // Diagnostic [0,1]
}

export interface HealthMetrics {
  health: number; // Overall health score [0,100]
  squd_score: SQUDScore;
  assessed_at: string; // ISO datetime string
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  [key: string]: string | number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

