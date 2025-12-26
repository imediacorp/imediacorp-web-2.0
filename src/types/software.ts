/**
 * Software Performance Domain Type Definitions
 */

import { SQUDScore, HealthMetrics } from './api';

// ============================================================================
// Software Performance Types
// ============================================================================

export interface SoftwareTelemetry {
  cpu_usage: number; // 0-100%
  memory_usage: number; // 0-100%
  response_time: number; // ms
  error_rate: number; // 0-1 (errors per request)
  throughput: number; // requests per second
  active_connections?: number;
  disk_io?: number; // MB/s
  network_io?: number; // MB/s
  cache_hit_rate?: number; // 0-1
  database_query_time?: number; // ms
  timestamp?: string;
}

export interface SoftwareConfig {
  cpu_threshold?: number;
  memory_threshold?: number;
  response_time_threshold?: number;
  error_rate_threshold?: number;
  [key: string]: unknown;
}

export interface SoftwareAssessmentRequest {
  service_id: string;
  telemetry: SoftwareTelemetry;
  config?: SoftwareConfig;
}

export interface SoftwareAssessmentResponse extends HealthMetrics {
  service_id: string;
  assessment_id: string;
  performance_score?: number;
  reliability_score?: number;
  scalability_score?: number;
  component_health?: {
    cpu?: number;
    memory?: number;
    response_time?: number;
    error_rate?: number;
    throughput?: number;
  };
  software_metrics?: {
    availability?: number;
    latency_p50?: number;
    latency_p95?: number;
    latency_p99?: number;
    requests_per_second?: number;
  };
}

export interface SoftwareTimeSeriesData {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  response_time: number;
  error_rate: number;
  throughput: number;
  S: number;
  Q: number;
  U: number;
  D: number;
}

export interface SoftwareMetrics {
  service_id: string;
  metrics: SoftwareTelemetry[];
  squd_time_series: Array<{
    timestamp: string;
    squd: SQUDScore;
  }>;
}

