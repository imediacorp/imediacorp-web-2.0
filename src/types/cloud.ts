/**
 * Cloud Platform Domain Type Definitions
 */

import { SQUDScore, HealthMetrics } from './api';

// ============================================================================
// Cloud Platform Types
// ============================================================================

export interface CloudTelemetry {
  cpu_utilization: number; // 0-100%
  memory_utilization: number; // 0-100%
  disk_utilization: number; // 0-100%
  network_in: number; // MB/s
  network_out: number; // MB/s
  request_count: number; // requests per minute
  error_count: number; // errors per minute
  latency_p50?: number; // ms
  latency_p95?: number; // ms
  latency_p99?: number; // ms
  availability?: number; // 0-1
  cost_per_hour?: number; // USD
  timestamp?: string;
}

export interface CloudConfig {
  cpu_threshold?: number;
  memory_threshold?: number;
  disk_threshold?: number;
  error_rate_threshold?: number;
  cost_threshold?: number;
  [key: string]: unknown;
}

export interface CloudAssessmentRequest {
  platform_id: string;
  telemetry: CloudTelemetry;
  config?: CloudConfig;
}

export interface CloudAssessmentResponse extends HealthMetrics {
  platform_id: string;
  assessment_id: string;
  efficiency_score?: number;
  cost_efficiency?: number;
  scalability_score?: number;
  component_health?: {
    compute?: number;
    storage?: number;
    network?: number;
    availability?: number;
  };
  cloud_metrics?: {
    resource_utilization?: number;
    cost_performance_ratio?: number;
    auto_scaling_status?: string;
    region_health?: string;
  };
}

export interface CloudTimeSeriesData {
  timestamp: string;
  cpu_utilization: number;
  memory_utilization: number;
  disk_utilization: number;
  network_in: number;
  network_out: number;
  request_count: number;
  error_count: number;
  S: number;
  Q: number;
  U: number;
  D: number;
}

export interface CloudMetrics {
  platform_id: string;
  metrics: CloudTelemetry[];
  squd_time_series: Array<{
    timestamp: string;
    squd: SQUDScore;
  }>;
}

