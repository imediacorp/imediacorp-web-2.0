/**
 * Quantum Computing Domain Types
 * Types for quantum qubit monitoring, gate fidelity, and coherence tracking
 */

import type { SQUDScore } from './api';

/**
 * Quantum telemetry metrics
 */
export interface QuantumTelemetry {
  fidelity: number; // Gate fidelity [0,1]
  t1?: number; // T1 coherence time (microseconds)
  t2?: number; // T2 coherence time (microseconds)
  noise?: number; // Noise level
  crosstalk?: number; // Crosstalk metric [0,1]
  qubit_id?: string; // Qubit identifier
  timestamp?: string; // ISO timestamp
}

/**
 * Quantum assessment request
 */
export interface QuantumAssessmentRequest {
  asset_id: string;
  telemetry: QuantumTelemetry;
  config?: {
    fidelity_threshold?: number; // Fidelity threshold for alerts
    t1_nominal?: number; // Nominal T1 time
    t2_nominal?: number; // Nominal T2 time
    noise_threshold?: number; // Noise threshold
    crosstalk_threshold?: number; // Crosstalk threshold
  };
}

/**
 * Quantum assessment response
 */
export interface QuantumAssessmentResponse {
  asset_id: string;
  assessment_id: string;
  squd_score: SQUDScore;
  health: number; // Health score [0,100] = 100*(1-D)
  coherence_quality?: number; // Coherence quality [0,1]
  gate_fidelity_avg?: number; // Average gate fidelity [0,1]
  noise_level?: number; // Noise level [0,1]
  assessed_at: string; // ISO timestamp
  recommendations?: string[];
  qubit_metrics?: {
    fidelity_mean?: number;
    fidelity_min?: number;
    fidelity_std?: number;
    t1_mean?: number;
    t2_mean?: number;
    noise_mean?: number;
    crosstalk_mean?: number;
  };
}

/**
 * Randomized benchmarking request
 */
export interface RandomizedBenchmarkingRequest {
  asset_id: string;
  gate_sequence_length?: number; // Default: 10
  n_sequences?: number; // Default: 100
  depolarizing_noise?: number; // Optional noise parameter [0,1]
}

/**
 * Randomized benchmarking response
 */
export interface RandomizedBenchmarkingResponse {
  asset_id: string;
  rb_id: string;
  average_fidelity: number; // Average gate fidelity [0,1]
  fidelity_decay_rate?: number; // Fidelity decay rate
  error_rate?: number; // Error rate [0,1]
  sequences_tested: number;
  assessed_at: string; // ISO timestamp
}

/**
 * Quantum time series data point
 */
export interface QuantumTimeSeriesData {
  timestamp: string; // ISO timestamp
  fidelity: number;
  t1?: number;
  t2?: number;
  noise?: number;
  crosstalk?: number;
  S: number;
  Q: number;
  U: number;
  D: number;
  low_fidelity?: number; // Binary flag for low fidelity
}

/**
 * Quantum processor summary
 */
export interface QuantumProcessorSummary {
  processor_id: string;
  qubit_count: number;
  aggregate_squd: SQUDScore;
  average_fidelity: number;
  average_t1?: number;
  average_t2?: number;
  last_updated: string; // ISO timestamp
}

