/**
 * Wind SCADA Dashboard Types
 */

import { SQUDScore } from './api';

/**
 * Wind turbine/plant telemetry data
 */
export interface WindTelemetry {
  wind_speed?: number; // m/s (hub height)
  turbine_power?: number; // kW (per turbine or total)
  plant_power?: number; // kW (total plant generation)
  nacelle_temp?: number; // °C
  gearbox_temp?: number; // °C
  vibration?: number; // mm/s
  availability?: number; // % (0-100)
  timestamp?: string;
}

/**
 * Wind plant assessment response
 */
export interface WindAssessmentResponse {
  squd_score: SQUDScore;
  health: number; // 0-100
  turbine_health_status: 'normal' | 'warn' | 'alarm';
  drivetrain_health_status: 'normal' | 'warn' | 'alarm';
  availability_status: 'normal' | 'warn' | 'alarm';
  recommendations: string[];
  component_health?: Record<string, number>;
  plant_metrics?: {
    expected_generation?: number; // kW
    actual_generation?: number; // kW
    capacity_factor?: number; // %
    availability?: number; // %
    wind_speed_avg?: number; // m/s
  };
}

/**
 * Wind assessment request
 */
export interface WindAssessmentRequest {
  plant_id: string;
  telemetry: WindTelemetry;
  config?: {
    nameplate_capacity?: number; // kW (per turbine or total)
    turbine_count?: number;
    rated_wind_speed?: number; // m/s (typically 12-15 m/s)
    cut_in_wind_speed?: number; // m/s (typically 3-4 m/s)
    cut_out_wind_speed?: number; // m/s (typically 20-25 m/s)
  };
}

/**
 * Wind time series data point
 */
export interface WindTimeSeriesData {
  timestamp: string;
  wind_speed?: number;
  turbine_power?: number;
  plant_power?: number;
  nacelle_temp?: number;
  gearbox_temp?: number;
  vibration?: number;
  availability?: number;
  S?: number;
  Q?: number;
  U?: number;
  D?: number;
}


