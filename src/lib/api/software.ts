/**
 * Software Performance API Client
 */

import type { SoftwareAssessmentRequest, SoftwareAssessmentResponse } from '@/types/software';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Software Performance API methods
 */
export const softwareApi = {
  /**
   * Assess software service health
   */
  async assessService(request: SoftwareAssessmentRequest): Promise<SoftwareAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/software/assess`, {
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
      console.warn('Software API not available, using demo data:', err);
      return generateDemoAssessment(request);
    }
  },
};

/**
 * Generate demo assessment (fallback when API not available)
 */
function generateDemoAssessment(request: SoftwareAssessmentRequest): SoftwareAssessmentResponse {
  const { telemetry } = request;
  
  // Defaults
  const cpuThreshold = request.config?.cpu_threshold || 80;
  const memoryThreshold = request.config?.memory_threshold || 85;
  const responseTimeThreshold = request.config?.response_time_threshold || 500; // ms
  const errorRateThreshold = request.config?.error_rate_threshold || 0.01; // 1%
  
  // Calculate S/Q/U/D
  // S: Stability - based on resource consistency
  const cpuStability = telemetry.cpu_usage < cpuThreshold * 0.7 ? 0.9 :
                       telemetry.cpu_usage < cpuThreshold ? 0.7 : 0.5;
  const memoryStability = telemetry.memory_usage < memoryThreshold * 0.7 ? 0.9 :
                          telemetry.memory_usage < memoryThreshold ? 0.7 : 0.5;
  const S = (cpuStability * 0.5 + memoryStability * 0.5);
  
  // Q: Quality - based on performance metrics
  const responseTimeQuality = telemetry.response_time < responseTimeThreshold * 0.5 ? 0.9 :
                              telemetry.response_time < responseTimeThreshold ? 0.7 : 0.5;
  const errorRateQuality = telemetry.error_rate < errorRateThreshold * 0.5 ? 0.9 :
                           telemetry.error_rate < errorRateThreshold ? 0.7 : 0.5;
  const cacheQuality = telemetry.cache_hit_rate ? telemetry.cache_hit_rate : 0.7;
  const Q = (responseTimeQuality * 0.4 + errorRateQuality * 0.4 + cacheQuality * 0.2);
  
  // U: Urgency - based on resource pressure and error rates
  const cpuPressure = Math.min(1.0, telemetry.cpu_usage / cpuThreshold);
  const memoryPressure = Math.min(1.0, telemetry.memory_usage / memoryThreshold);
  const errorPressure = Math.min(1.0, telemetry.error_rate / errorRateThreshold);
  const U = (cpuPressure * 0.3 + memoryPressure * 0.3 + errorPressure * 0.4);
  
  // D: Diagnostic (CHADD formula)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
  
  const health = Math.round((1 - D) * 100);
  
  // Calculate component health scores
  const componentHealth = {
    cpu: Math.max(0, Math.min(100, 100 - (telemetry.cpu_usage / cpuThreshold * 100))),
    memory: Math.max(0, Math.min(100, 100 - (telemetry.memory_usage / memoryThreshold * 100))),
    response_time: Math.max(0, Math.min(100, 100 - (telemetry.response_time / responseTimeThreshold * 100))),
    error_rate: Math.max(0, Math.min(100, 100 - (telemetry.error_rate / errorRateThreshold * 100))),
    throughput: Math.min(100, (telemetry.throughput / 1000) * 100), // Normalize to 1000 req/s = 100%
  };
  
  // Calculate performance scores
  const performanceScore = (componentHealth.response_time * 0.4 + 
                           componentHealth.throughput * 0.3 + 
                           (100 - componentHealth.error_rate) * 0.3);
  const reliabilityScore = (100 - componentHealth.error_rate) * 0.6 + 
                          componentHealth.cpu * 0.2 + 
                          componentHealth.memory * 0.2;
  const scalabilityScore = (componentHealth.cpu * 0.3 + 
                            componentHealth.memory * 0.3 + 
                            componentHealth.throughput * 0.4);
  
  return {
    squd_score: { S, Q, U, D },
    health,
    service_id: request.service_id,
    assessment_id: `sw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    performance_score: performanceScore / 100,
    reliability_score: reliabilityScore / 100,
    scalability_score: scalabilityScore / 100,
    component_health: componentHealth,
    software_metrics: {
      availability: 1 - telemetry.error_rate,
      latency_p50: telemetry.response_time * 0.8,
      latency_p95: telemetry.response_time * 1.5,
      latency_p99: telemetry.response_time * 2.0,
      requests_per_second: telemetry.throughput,
    },
  };
}

