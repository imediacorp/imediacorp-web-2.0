/**
 * Aerospace Dashboard Types
 */

import { SQUDScore } from './api';

/**
 * Aerospace/UAV radar/avionics telemetry data
 */
export interface AerospaceTelemetry {
  signal: number; // Radar/signal amplitude
  snr?: number; // Signal-to-noise ratio (dB)
  drift?: number; // Signal drift
  noise?: number; // Noise level
  timestamp?: string;
}

/**
 * Aerospace asset assessment response
 */
export interface AerospaceAssessmentResponse {
  asset_id: string;
  assessment_id: string;
  squd_score: SQUDScore;
  health: number; // 0-100
  anomaly_detected: boolean;
  signal_quality?: number; // 0-1
  assessed_at: string; // ISO datetime string
  status?: 'normal' | 'warn' | 'alarm';
  recommendations?: string[];
  component_health?: Record<string, number>;
}

/**
 * Aerospace assessment request
 */
export interface AerospaceAssessmentRequest {
  asset_id: string;
  telemetry: AerospaceTelemetry;
  config?: {
    asset_type?: string; // UAV, radar, avionics, etc.
    z_threshold?: number; // Z-score threshold for anomaly detection
    signal_quality_threshold?: number; // Signal quality threshold
    snr_threshold?: number; // SNR threshold (dB)
  };
}

/**
 * Aerospace time series data point
 */
export interface AerospaceTimeSeriesData {
  timestamp: string;
  signal?: number;
  snr?: number;
  drift?: number;
  noise?: number;
  anomaly?: number; // Binary: 0 or 1
  z_score?: number;
  S?: number;
  Q?: number;
  U?: number;
  D?: number;
}

