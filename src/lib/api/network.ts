/**
 * Network API Client
 */

import type { NetworkAssessmentRequest, NetworkAssessmentResponse } from '@/types/network';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Network API methods
 */
export const networkApi = {
  /**
   * Assess network device health
   */
  async assessDevice(request: NetworkAssessmentRequest): Promise<NetworkAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/network/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        // Fallback to demo data if API not available
        return generateDemoAssessment(request);
      }

      return response.json();
    } catch (err) {
      // Fallback to demo data if API not available
      console.warn('Network API not available, using demo data:', err);
      return generateDemoAssessment(request);
    }
  },
};

/**
 * Generate demo assessment (fallback when API not available)
 */
function generateDemoAssessment(request: NetworkAssessmentRequest): NetworkAssessmentResponse {
  const { telemetry } = request;
  
  // Defaults
  const cpuThreshold = request.config?.cpu_threshold || 80;
  const memoryThreshold = request.config?.memory_threshold || 85;
  const temperatureThreshold = request.config?.temperature_threshold || 75;
  const errorRateThreshold = request.config?.error_rate_threshold || 100; // errors/sec
  const bcastRatioThreshold = request.config?.bcast_ratio_threshold || 0.2;
  const mcastRatioThreshold = request.config?.mcast_ratio_threshold || 0.3;
  
  // Calculate S/Q/U/D based on network domain logic
  // S: Stability - declines when load or noise rises
  // Based on CPU, memory, and packet rate load
  const cpuLoad = Math.min(1.0, telemetry.cpu_1m / cpuThreshold);
  const memLoad = Math.min(1.0, telemetry.mem_used_pct / memoryThreshold);
  const pktLoad = Math.min(1.0, (telemetry.pkt_rate || 0) / 100000); // Normalize to 100k pps
  
  // Noise factor: error rate and broadcast/multicast ratios
  const errorNoise = Math.min(1.0, (telemetry.err_rate || 0) / errorRateThreshold);
  const bcastNoise = Math.min(1.0, (telemetry.bcast_ratio || 0) / bcastRatioThreshold);
  const mcastNoise = Math.min(1.0, (telemetry.mcast_ratio || 0) / mcastRatioThreshold);
  const noiseFactor = (errorNoise * 0.5 + bcastNoise * 0.25 + mcastNoise * 0.25);
  
  // Stability decreases with load and noise
  const loadFactor = (cpuLoad * 0.4 + memLoad * 0.3 + pktLoad * 0.3);
  const S = Math.max(0, 1.0 - (loadFactor * 0.6 + noiseFactor * 0.4));
  
  // Q: Dissonance/Noise (good when low)
  // Rises with interface errors and L2 noise (broadcast/multicast)
  const integrityFactor = 1.0 - (telemetry.integrity_score || 0.9);
  const Q = Math.min(1.0, (errorNoise * 0.5 + bcastNoise * 0.25 + mcastNoise * 0.15 + integrityFactor * 0.1));
  
  // U: Utilization/Effort (good when moderate)
  // Rises with device load and thermal stress
  const tempPressure = Math.min(1.0, telemetry.temp_c / temperatureThreshold);
  const U = Math.min(1.0, (loadFactor * 0.7 + tempPressure * 0.3));
  
  // D: Diagnostic signal (CHADD-derived from S and U)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
  
  const health = Math.round((1 - D) * 100);
  
  // Calculate component health scores
  const componentHealth = {
    cpu: Math.max(0, Math.min(100, 100 - (telemetry.cpu_1m / cpuThreshold * 100))),
    memory: Math.max(0, Math.min(100, 100 - (telemetry.mem_used_pct / memoryThreshold * 100))),
    temperature: Math.max(0, Math.min(100, 100 - ((telemetry.temp_c - 20) / (temperatureThreshold - 20) * 100))),
    packet_rate: Math.min(100, 100 - (loadFactor * 100)),
    error_rate: Math.max(0, Math.min(100, 100 - (errorNoise * 100))),
    bcast_ratio: Math.max(0, Math.min(100, 100 - (bcastNoise * 100))),
    mcast_ratio: Math.max(0, Math.min(100, 100 - (mcastNoise * 100))),
    integrity: (telemetry.integrity_score || 0.9) * 100,
  };
  
  // Calculate status indicators
  const cpuStatus = telemetry.cpu_1m < cpuThreshold * 0.7 ? 'normal' : 
                    telemetry.cpu_1m < cpuThreshold ? 'warn' : 'critical';
  const memoryStatus = telemetry.mem_used_pct < memoryThreshold * 0.7 ? 'normal' :
                       telemetry.mem_used_pct < memoryThreshold ? 'warn' : 'critical';
  const temperatureStatus = telemetry.temp_c < temperatureThreshold * 0.8 ? 'normal' :
                            telemetry.temp_c < temperatureThreshold ? 'warn' : 'critical';
  const errorStatus = errorNoise < 0.5 ? 'normal' :
                      errorNoise < 0.8 ? 'warn' : 'critical';
  const trafficStatus = (bcastNoise + mcastNoise) / 2 < 0.5 ? 'normal' :
                        (bcastNoise + mcastNoise) / 2 < 0.8 ? 'warn' : 'critical';
  
  // Estimate network metrics
  const availability = 1.0 - Math.min(0.1, (telemetry.err_rate || 0) / 1000);
  const latency = 1.0 + (telemetry.cpu_1m / 100) * 10; // Estimate latency based on CPU
  const throughput = (telemetry.pkt_rate || 0) * 1500 * 8 / 1000000; // Estimate Mbps (1500 bytes/packet)
  const packetLoss = Math.min(1.0, (telemetry.err_rate || 0) / (telemetry.pkt_rate || 1));
  const utilization = loadFactor;
  
  return {
    squd_score: { S, Q, U, D },
    health,
    device_id: request.device_id,
    assessment_id: `net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    component_health: componentHealth,
    network_metrics: {
      availability,
      latency,
      throughput,
      packet_loss: packetLoss,
      utilization,
    },
    status: {
      cpu_status: cpuStatus,
      memory_status: memoryStatus,
      temperature_status: temperatureStatus,
      error_status: errorStatus,
      traffic_status: trafficStatus,
    },
  };
}

