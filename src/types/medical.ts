/**
 * Medical Domain Type Definitions
 */

import { SQUDScore, HealthMetrics } from './api';

// ============================================================================
// Medical/Vital Signs Types
// ============================================================================

export interface MedicalTelemetry {
  heart_rate: number; // bpm
  respiratory_rate: number; // breaths/min
  systolic_bp: number; // mmHg
  diastolic_bp: number; // mmHg
  body_temp: number; // °C
  oxygen_saturation: number; // SpO2, 0-100%
  patient_age?: number;
  patient_weight?: number; // kg
  timestamp?: string;
}

export interface MedicalConfig {
  age?: number;
  weight?: number;
  baseline_hr?: number;
  baseline_rr?: number;
  [key: string]: unknown;
}

export interface MedicalAssessmentRequest {
  patient_id: string;
  telemetry: MedicalTelemetry;
  config?: MedicalConfig;
}

export interface MedicalAssessmentResponse extends HealthMetrics {
  patient_id: string;
  assessment_id: string;
  risk_score?: number;
  risk_tier?: 'low' | 'medium' | 'high' | 'critical';
  vital_status?: {
    heart_rate?: 'normal' | 'tachycardia' | 'bradycardia';
    respiratory_rate?: 'normal' | 'tachypnea' | 'bradypnea';
    blood_pressure?: 'normal' | 'hypertension' | 'hypotension';
    temperature?: 'normal' | 'fever' | 'hypothermia';
    oxygen_saturation?: 'normal' | 'hypoxia';
  };
  component_health?: {
    cardiovascular?: number;
    respiratory?: number;
    oxygenation?: number;
    thermoregulation?: number;
  };
  medical_metrics?: {
    hr_variability?: number;
    bp_stability?: number;
    respiratory_efficiency?: number;
    oxygen_efficiency?: number;
  };
  recommendations?: string[];
}

export interface MedicalTimeSeriesData {
  timestamp: string;
  heart_rate: number;
  respiratory_rate: number;
  systolic_bp: number;
  diastolic_bp: number;
  body_temp: number;
  oxygen_saturation: number;
  S: number;
  Q: number;
  U: number;
  D: number;
}

export interface MedicalMetrics {
  patient_id: string;
  metrics: MedicalTelemetry[];
  squd_time_series: Array<{
    timestamp: string;
    squd: SQUDScore;
  }>;
}

// ============================================================================
// Biomechanical Types
// ============================================================================

export interface BiomechanicalTelemetry {
  // Gait data
  stride_time?: number;
  step_length_left?: number;
  step_length_right?: number;
  cadence?: number;
  gait_velocity?: number;
  
  // Balance/Force plate data
  cop_x?: number;
  cop_y?: number;
  force_x?: number;
  force_y?: number;
  force_z?: number;
  
  // Kinematics data
  joint_angle?: number;
  joint_angle_velocity?: number;
  range_of_motion?: number;
  
  // IMU data
  accel_x?: number;
  accel_y?: number;
  accel_z?: number;
  gyro_x?: number;
  gyro_y?: number;
  gyro_z?: number;
  
  timestamp?: string;
}

export interface BiomechanicalAssessmentRequest {
  subject_id: string;
  telemetry: BiomechanicalTelemetry[];
  data_type?: 'gait' | 'balance' | 'kinematics' | 'imu' | 'mixed';
  config?: Record<string, unknown>;
}

export interface BiomechanicalAssessmentResponse extends HealthMetrics {
  subject_id: string;
  assessment_id: string;
  movement_metrics?: {
    gait_velocity_mean?: number;
    stride_time_mean?: number;
    cop_sway_area?: number;
    cop_path_length?: number;
    joint_rom_mean?: number;
  };
  risk_score?: number;
  risk_tier?: 'low' | 'medium' | 'high';
  recommendations?: string[];
}

