/**
 * Network Domain Type Definitions
 */

import { SQUDScore, HealthMetrics } from './api';

// ============================================================================
// Network Domain Types
// ============================================================================

export interface NetworkTelemetry {
  cpu_1m: number; // CPU usage 1-minute average (0-100%)
  cpu_5m?: number; // CPU usage 5-minute average (0-100%)
  mem_used_pct: number; // Memory used percentage (0-100%)
  mem_total_kb?: number; // Total memory in KB
  mem_used_kb?: number; // Used memory in KB
  temp_c: number; // Temperature in Celsius
  pkt_rate: number; // Packet rate (packets per second)
  err_rate: number; // Error rate (errors per second)
  bcast_ratio: number; // Broadcast ratio (0-1)
  mcast_ratio: number; // Multicast ratio (0-1)
  integrity_score?: number; // ARP integrity score (0-1)
  in_total_pkts?: number; // Inbound total packets (counter)
  out_total_pkts?: number; // Outbound total packets (counter)
  in_bcast_pkts?: number; // Inbound broadcast packets (counter)
  in_mcast_pkts?: number; // Inbound multicast packets (counter)
  in_err_pkts?: number; // Inbound error packets (counter)
  out_err_pkts?: number; // Outbound error packets (counter)
  timestamp?: string;
}

export interface NetworkConfig {
  cpu_threshold?: number; // CPU warning threshold (0-100%)
  memory_threshold?: number; // Memory warning threshold (0-100%)
  temperature_threshold?: number; // Temperature warning threshold (°C)
  error_rate_threshold?: number; // Error rate threshold (errors/sec)
  bcast_ratio_threshold?: number; // Broadcast ratio threshold (0-1)
  mcast_ratio_threshold?: number; // Multicast ratio threshold (0-1)
  [key: string]: unknown;
}

export interface NetworkAssessmentRequest {
  device_id: string;
  telemetry: NetworkTelemetry;
  config?: NetworkConfig;
}

export interface NetworkAssessmentResponse extends HealthMetrics {
  device_id: string;
  assessment_id: string;
  component_health?: {
    cpu?: number;
    memory?: number;
    temperature?: number;
    packet_rate?: number;
    error_rate?: number;
    bcast_ratio?: number;
    mcast_ratio?: number;
    integrity?: number;
  };
  network_metrics?: {
    availability?: number; // Network availability (0-1)
    latency?: number; // Network latency (ms)
    throughput?: number; // Network throughput (Mbps)
    packet_loss?: number; // Packet loss rate (0-1)
    utilization?: number; // Network utilization (0-1)
  };
  status?: {
    cpu_status?: 'normal' | 'warn' | 'critical';
    memory_status?: 'normal' | 'warn' | 'critical';
    temperature_status?: 'normal' | 'warn' | 'critical';
    error_status?: 'normal' | 'warn' | 'critical';
    traffic_status?: 'normal' | 'warn' | 'critical';
  };
}

export interface NetworkTimeSeriesData {
  timestamp: string;
  cpu_1m: number;
  mem_used_pct: number;
  temp_c: number;
  pkt_rate: number;
  err_rate: number;
  bcast_ratio: number;
  mcast_ratio: number;
  integrity_score?: number;
  S: number;
  Q: number;
  U: number;
  D: number;
}

export interface NetworkMetrics {
  device_id: string;
  metrics: NetworkTelemetry[];
  squd_time_series: Array<{
    timestamp: string;
    squd: SQUDScore;
  }>;
}

