/**
 * Vehicle Domain Type Definitions
 */

import { SQUDScore, HealthMetrics } from './api';

// ============================================================================
// Gas Vehicle Types
// ============================================================================

export interface GasVehicleTelemetry {
  engine_rpm: number;
  coolant_temp: number;
  throttle_position: number; // 0-100%
  maf: number; // Mass air flow (g/s)
  o2_sensor_1: number;
  timing_advance: number;
  vehicle_speed?: number;
  intake_temp?: number;
  fuel_pressure?: number;
  oil_pressure?: number;
  vibration?: number;
  fuel_trim_short?: number;
  fuel_trim_long?: number;
  dtc_count?: number;
  timestamp?: string;
}

export interface GasVehicleConfig {
  temp_threshold?: number;
  ambient_temp?: number;
  [key: string]: unknown;
}

export interface GasVehicleAssessmentRequest {
  vehicle_id: string;
  telemetry: GasVehicleTelemetry;
  config?: GasVehicleConfig;
}

export interface GasVehicleAssessmentResponse extends HealthMetrics {
  vehicle_id: string;
  assessment_id: string;
  combustion_quality?: number;
  thermal_stress?: number;
  engine_load?: number;
}

export interface GasVehicleMetrics {
  vehicle_id: string;
  metrics: GasVehicleTelemetry[];
  squd_time_series: Array<{
    timestamp: string;
    squd: SQUDScore;
  }>;
}

export interface GasVehicleDataSource {
  type: 'csv' | 'demo' | 'hantek' | 'obd2' | 'can';
  file?: File;
  hantek_data?: {
    records: Array<{
      timestamp: string;
      ch1_voltage: number;
      ch2_voltage: number;
      ch3_voltage: number;
      ch4_voltage: number;
      ch5_voltage: number;
      ch6_voltage: number;
      ch7_voltage: number;
      ch8_voltage: number;
    }>;
  };
}

// ============================================================================
// Electric Vehicle Types
// ============================================================================

export interface ElectricVehicleTelemetry {
  battery_soc: number; // 0-100%
  battery_voltage?: number;
  battery_current?: number;
  battery_temp?: number;
  motor_current?: number;
  motor_voltage?: number;
  motor_speed?: number;
  motor_temp?: number;
  vehicle_speed?: number;
  torque?: number;
  power_kw?: number;
  vibration?: number;
  timestamp?: string;
}

export interface ElectricVehicleConfig {
  battery_capacity_kwh?: number;
  battery_temp_threshold?: number;
  motor_temp_threshold?: number;
  low_soc_threshold?: number;
  [key: string]: unknown;
}

export interface ElectricVehicleAssessmentRequest {
  vehicle_id: string;
  telemetry: ElectricVehicleTelemetry;
  config?: ElectricVehicleConfig;
}

export interface ElectricVehicleAssessmentResponse extends HealthMetrics {
  vehicle_id: string;
  assessment_id: string;
  efficiency?: number;
  battery_health?: number;
  motor_health?: number;
}

export interface ElectricVehicleMetrics {
  vehicle_id: string;
  metrics: ElectricVehicleTelemetry[];
  squd_time_series: Array<{
    timestamp: string;
    squd: SQUDScore;
  }>;
}

export interface ElectricVehicleDataSource {
  type: 'csv' | 'demo' | 'hantek';
  file?: File;
  hantek_data?: {
    records: Array<{
      timestamp: string;
      ch1_voltage: number;
      ch2_voltage: number;
      ch3_voltage: number;
      ch4_voltage: number;
      ch5_voltage: number;
      ch6_voltage: number;
      ch7_voltage: number;
      ch8_voltage: number;
    }>;
  };
}

