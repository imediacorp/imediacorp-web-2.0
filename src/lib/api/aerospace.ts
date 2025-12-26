/**
 * Aerospace API Client
 */

import type { AerospaceAssessmentRequest, AerospaceAssessmentResponse } from '@/types/aerospace';

/**
 * Aerospace API methods
 */
export const aerospaceApi = {
  /**
   * Assess aerospace/avionics system health
   */
  async assessAsset(request: AerospaceAssessmentRequest): Promise<AerospaceAssessmentResponse> {
    // For now, simulate the response until backend API is available
    // TODO: Replace with actual API call when endpoint is available
    const response = await fetch('/api/v1/aerospace/assets/' + request.asset_id + '/assess', {
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
  },
};

/**
 * Generate demo assessment (fallback when API not available)
 */
function generateDemoAssessment(request: AerospaceAssessmentRequest): AerospaceAssessmentResponse {
  const { telemetry, config } = request;
  
  const signal = telemetry.signal || 5.0;
  const snr = telemetry.snr || 15.0; // dB
  const drift = telemetry.drift || 0.01;
  const noise = telemetry.noise || 0.5;
  
  // Signal quality (0-1): higher SNR -> higher quality
  const signalQuality = Math.min(1.0, (snr + 10.0) / 30.0);
  
  // Anomaly detection: low SNR, high noise, or high drift
  const zThreshold = config?.z_threshold || 3.0;
  const snrThreshold = config?.snr_threshold || 10.0;
  const anomalyDetected = snr < snrThreshold || noise > 1.0 || Math.abs(drift) > 0.05;
  
  // Map to S/Q/U/D (based on aerospace domain mapping)
  // S (Stability): signal stability, SNR, drift penalty
  const signalStability = Math.max(0.0, Math.min(1.0, 1.0 - (noise / 2.0))); // Inverse of noise
  const snrContrib = Math.max(0.0, Math.min(1.0, (snr + 10.0) / 30.0)); // Normalize SNR [0,1]
  const driftPenalty = Math.min(1.0, Math.abs(drift) * 20.0); // Drift penalty
  const S = Math.max(0.0, Math.min(1.0, 0.5 * signalStability + 0.3 * snrContrib - 0.2 * driftPenalty));
  
  // Q (Coherence/Quality Pressure): signal coherence, tracking precision (higher is worse)
  const coherence = Math.max(0.0, Math.min(1.0, 1.0 - (noise / 1.5))); // Inverse of noise
  const precision = Math.max(0.0, Math.min(1.0, 1.0 - (noise / 2.0))); // Tracking precision
  const Q = Math.max(0.0, Math.min(1.0, 0.6 * (1.0 - coherence) + 0.4 * (1.0 - precision)));
  
  // U (Susceptibility/Effort): noise levels, processing load (higher is worse)
  const noisePressure = Math.min(1.0, noise / 2.0); // Normalize noise
  const loadProxy = Math.min(1.0, noise / 1.5); // Processing load proxy
  const U = Math.max(0.0, Math.min(1.0, 0.7 * noisePressure + 0.3 * loadProxy));
  
  // D (Diagnostic): CHADD formula
  // D = 1 / (1 + exp(-(S - U)))
  const D = 1.0 / (1.0 + Math.exp(-(S - U)));
  const D_clamped = Math.max(0.0, Math.min(1.0, D));
  
  const health = Math.round((1.0 - D_clamped) * 100);
  
  // Determine status
  let status: 'normal' | 'warn' | 'alarm' = 'normal';
  if (D_clamped > 0.6 || anomalyDetected) {
    status = 'alarm';
  } else if (D_clamped > 0.4 || snr < 12.0) {
    status = 'warn';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (anomalyDetected) {
    if (snr < snrThreshold) {
      recommendations.push(`Low signal-to-noise ratio (${snr.toFixed(1)} dB) - investigate signal source and interference`);
    }
    if (noise > 1.0) {
      recommendations.push(`High noise levels (${noise.toFixed(2)}) - check signal conditioning and filters`);
    }
    if (Math.abs(drift) > 0.05) {
      recommendations.push(`Significant signal drift (${drift.toFixed(3)}) - recalibrate sensors`);
    }
  } else {
    recommendations.push('Signal operating within normal parameters');
  }
  
  if (signalQuality < 0.7) {
    recommendations.push(`Signal quality below optimal (${(signalQuality * 100).toFixed(1)}%) - monitor closely`);
  }
  
  return {
    asset_id: request.asset_id,
    assessment_id: 'demo-assessment-' + Date.now(),
    squd_score: { S, Q, U, D: D_clamped },
    health,
    anomaly_detected: anomalyDetected,
    signal_quality: signalQuality,
    assessed_at: new Date().toISOString(),
    status,
    recommendations,
    component_health: {
      signal_quality: signalQuality * 100,
      snr_health: snr > 15 ? 90 : snr > 10 ? 70 : 50,
      noise_health: noise < 0.5 ? 90 : noise < 1.0 ? 70 : 50,
      stability_health: S > 0.7 ? 90 : S > 0.5 ? 70 : 50,
    },
  };
}

