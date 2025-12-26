/**
 * Industrial Fault Detection Dashboard Types
 */

import { SQUDScore } from './api';

/**
 * Industrial sensor telemetry data
 */
export interface IndustrialTelemetry {
  vibration: number; // mm/s (RMS)
  temperature: number; // °C
  pressure: number; // bar
  timestamp?: string;
}

/**
 * Industrial fault assessment response
 */
export interface IndustrialAssessmentResponse {
  squd_score: SQUDScore;
  health: number; // 0-100
  vibration_status: 'normal' | 'warn' | 'alarm';
  temperature_status: 'normal' | 'warn' | 'alarm';
  pressure_status: 'normal' | 'warn' | 'alarm';
  fault_detected: boolean;
  fault_type?: 'none' | 'bearing' | 'overheating';
  recommendations: string[];
  component_health?: Record<string, number>;
}

/**
 * Industrial assessment request
 */
export interface IndustrialAssessmentRequest {
  asset_id: string;
  telemetry: IndustrialTelemetry;
  config?: {
    vibration_threshold_warn?: number;
    vibration_threshold_alarm?: number;
    temperature_threshold_warn?: number;
    temperature_threshold_alarm?: number;
    pressure_min?: number;
    pressure_max?: number;
  };
}

/**
 * Industrial time series data point
 */
export interface IndustrialTimeSeriesData {
  timestamp: string;
  vibration: number;
  temperature: number;
  pressure: number;
  S?: number;
  Q?: number;
  U?: number;
  D?: number;
  fault_label?: number; // 0: No Fault, 1: Bearing Fault, 2: Overheating
}

