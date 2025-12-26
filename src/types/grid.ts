/**
 * Grid/Substation Dashboard Types
 */

import { SQUDScore } from './api';

/**
 * Grid/Substation telemetry data
 */
export interface GridTelemetry {
  voltage: number; // kV
  frequency: number; // Hz
  power_flow?: number; // MW
  transformer_temp?: number; // °C
  current?: number; // A
  timestamp?: string;
}

/**
 * Grid/Substation assessment response
 */
export interface GridAssessmentResponse {
  squd_score: SQUDScore;
  health: number; // 0-100
  voltage_status: 'normal' | 'warn' | 'alarm';
  frequency_status: 'normal' | 'warn' | 'alarm';
  power_quality_status: 'normal' | 'warn' | 'alarm';
  outage_detected?: boolean;
  recommendations: string[];
  component_health?: Record<string, number>;
  grid_metrics?: {
    voltage_deviation?: number; // % from nominal
    frequency_deviation?: number; // % from nominal (60 Hz or 50 Hz)
    power_quality_index?: number; // 0-100
  };
}

/**
 * Grid assessment request
 */
export interface GridAssessmentRequest {
  substation_id: string;
  telemetry: GridTelemetry;
  config?: {
    voltage_nominal?: number; // kV (default 13.8 or varies by region)
    voltage_tolerance?: number; // % (default ±5%)
    frequency_nominal?: number; // Hz (default 60 for US, 50 for EU)
    frequency_tolerance?: number; // % (default ±0.1%)
    transformer_temp_max?: number; // °C
  };
}

/**
 * Grid time series data point
 */
export interface GridTimeSeriesData {
  timestamp: string;
  voltage: number;
  frequency: number;
  power_flow?: number;
  transformer_temp?: number;
  S?: number;
  Q?: number;
  U?: number;
  D?: number;
  outage_event?: boolean;
}

