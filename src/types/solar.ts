/**
 * Solar SCADA Dashboard Types
 */

import { SQUDScore } from './api';

/**
 * Solar inverter/plant telemetry data
 */
export interface SolarTelemetry {
  inverter_power?: number; // kW (per inverter or total)
  plant_power?: number; // kW (total plant generation)
  irradiance?: number; // W/m²
  ambient_temp?: number; // °C
  module_temp?: number; // °C
  performance_ratio?: number; // PR (0-1, typically 0.75-0.90)
  timestamp?: string;
}

/**
 * Solar plant assessment response
 */
export interface SolarAssessmentResponse {
  squd_score: SQUDScore;
  health: number; // 0-100
  performance_ratio?: number;
  inverter_health_status: 'normal' | 'warn' | 'alarm';
  plant_efficiency_status: 'normal' | 'warn' | 'alarm';
  recommendations: string[];
  component_health?: Record<string, number>;
  plant_metrics?: {
    expected_generation?: number; // kW
    actual_generation?: number; // kW
    efficiency?: number; // %
    availability?: number; // %
  };
}

/**
 * Solar assessment request
 */
export interface SolarAssessmentRequest {
  plant_id: string;
  telemetry: SolarTelemetry;
  config?: {
    nameplate_capacity?: number; // kW
    performance_ratio_target?: number; // default 0.80
    inverter_count?: number;
    expected_irradiance?: number; // W/m²
  };
}

/**
 * Solar time series data point
 */
export interface SolarTimeSeriesData {
  timestamp: string;
  inverter_power?: number;
  plant_power?: number;
  irradiance?: number;
  ambient_temp?: number;
  module_temp?: number;
  performance_ratio?: number;
  S?: number;
  Q?: number;
  U?: number;
  D?: number;
}

