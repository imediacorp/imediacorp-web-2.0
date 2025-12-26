/**
 * Personnel Domain Type Definitions
 */

import { SQUDScore, HealthMetrics } from './api';

// ============================================================================
// Personnel Health Types
// ============================================================================

export interface PersonnelMetrics {
  performance: number; // 0-1
  reliability: number; // 0-1
  collaboration: number; // 0-1
  learning: number; // 0-1
  well_being: number; // 0-1
  integrity: number; // 0-1
}

export interface PersonnelProfile {
  name: string;
  employee_id?: string;
  role?: string;
  department?: string;
  metrics: PersonnelMetrics;
  weight?: number; // FTE weight
}

export interface PersonnelConfig {
  business_name?: string;
  stress_scenario?: string;
  stress_intensity?: number;
  [key: string]: unknown;
}

export interface PersonnelAssessmentRequest {
  profile: PersonnelProfile;
  config?: PersonnelConfig;
}

export interface PersonnelAssessmentResponse extends HealthMetrics {
  profile_name: string;
  employee_id?: string;
  assessment_id: string;
  balance_score?: number; // Ma'at balance score
  risk_tier?: 'low' | 'medium' | 'high' | 'critical';
  component_health?: {
    performance?: number;
    reliability?: number;
    collaboration?: number;
    learning?: number;
    well_being?: number;
    integrity?: number;
  };
  squ_mapping?: {
    S: number;
    Q: number;
    U: number;
  };
  recommendations?: string[];
}

export interface CompanyAggregateRequest {
  profiles: PersonnelProfile[];
  config?: PersonnelConfig;
}

export interface CompanyAggregateResponse extends HealthMetrics {
  assessment_id: string;
  headcount: number;
  total_weight: number;
  balance_score?: number;
  squ_mapping?: {
    S: number;
    Q: number;
    U: number;
  };
  aggregate_metrics?: PersonnelMetrics;
  component_health?: {
    performance?: number;
    reliability?: number;
    collaboration?: number;
    learning?: number;
    well_being?: number;
    integrity?: number;
  };
  risk_tier?: 'low' | 'medium' | 'high' | 'critical';
  recommendations?: string[];
}

export interface PersonnelTimeSeriesData {
  timestamp: string;
  performance: number;
  reliability: number;
  collaboration: number;
  learning: number;
  well_being: number;
  integrity: number;
  S: number;
  Q: number;
  U: number;
  D: number;
  balance?: number;
}

export interface StressScenario {
  name: string;
  intensity: number;
  affected_metrics: Partial<PersonnelMetrics>;
}


