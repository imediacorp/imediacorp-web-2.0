/**
 * Quantum Computing API Client
 */

import type {
  QuantumAssessmentRequest,
  QuantumAssessmentResponse,
  RandomizedBenchmarkingRequest,
  RandomizedBenchmarkingResponse,
  QuantumTimeSeriesData,
  QuantumTelemetry,
} from '@/types/quantum';

/**
 * Quantum API methods
 */
export const quantumApi = {
  /**
   * Assess quantum system/qubit health
   */
  async assessAsset(request: QuantumAssessmentRequest): Promise<QuantumAssessmentResponse> {
    try {
      const response = await fetch('/api/v1/quantum/assets/' + request.asset_id + '/assess', {
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
    } catch (error) {
      console.error('Quantum assessment API error:', error);
      return generateDemoAssessment(request);
    }
  },

  /**
   * Run randomized benchmarking
   */
  async runRandomizedBenchmarking(
    assetId: string,
    request: RandomizedBenchmarkingRequest
  ): Promise<RandomizedBenchmarkingResponse> {
    try {
      const response = await fetch(
        '/api/v1/quantum/assets/' + assetId + '/randomized-benchmarking',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        return generateDemoRB(assetId, request);
      }

      return response.json();
    } catch (error) {
      console.error('Randomized benchmarking API error:', error);
      return generateDemoRB(assetId, request);
    }
  },

  /**
   * Get quantum metrics time series
   */
  async getMetrics(
    assetId: string,
    startTime?: string,
    endTime?: string
  ): Promise<QuantumTimeSeriesData[]> {
    try {
      const params = new URLSearchParams();
      if (startTime) params.append('start_time', startTime);
      if (endTime) params.append('end_time', endTime);

      const response = await fetch(
        `/api/v1/quantum/assets/${assetId}/metrics?${params.toString()}`
      );

      if (!response.ok) {
        return generateDemoTimeSeries();
      }

      const data = await response.json();
      return data.squd_time_series || [];
    } catch (error) {
      console.error('Quantum metrics API error:', error);
      return generateDemoTimeSeries();
    }
  },
};

/**
 * Generate demo assessment (fallback when API not available)
 */
function generateDemoAssessment(
  request: QuantumAssessmentRequest
): QuantumAssessmentResponse {
  const { telemetry } = request;
  const config = request.config || {};

  const fidelityThreshold = config.fidelity_threshold || 0.95;
  const t1Nominal = config.t1_nominal || 100.0;
  const t2Nominal = config.t2_nominal || 80.0;

  const fidelity = telemetry.fidelity || 0.95;
  const t1 = telemetry.t1;
  const t2 = telemetry.t2;
  const noise = telemetry.noise || 0.01;
  const crosstalk = telemetry.crosstalk || 0.02;

  // Calculate S (Stability) - from coherence and gate stability
  let coherence = 0.5; // Default
  if (t1 && t2) {
    // Normalize T1/T2 to [0,1]
    const t1Norm = Math.max(0, Math.min(1, (t1 - 10) / 990)); // 10-1000 μs range
    const t2Norm = Math.max(0, Math.min(1, (t2 - 5) / 495)); // 5-500 μs range
    coherence = (t1Norm + t2Norm) / 2;
  } else if (t1) {
    coherence = Math.max(0, Math.min(1, (t1 - 10) / 990));
  } else if (t2) {
    coherence = Math.max(0, Math.min(1, (t2 - 5) / 495));
  }

  // Gate stability from fidelity consistency (simplified)
  const gateStability = fidelity;
  const reliability = fidelity;

  const S = Math.max(0, Math.min(1, 0.4 * coherence + 0.4 * gateStability + 0.2 * reliability));

  // Calculate Q (Coherence/Quality Pressure) - higher is worse
  // Fidelity variance (simplified - use inverse of fidelity)
  const fidVar = 1.0 - fidelity;
  const measRepro = fidelity; // Simplified
  const Q = Math.max(0, Math.min(1, 0.7 * fidVar + 0.3 * (1.0 - measRepro)));

  // Calculate U (Susceptibility/Effort) - higher is worse
  const noiseNorm = Math.min(1, noise / 0.1); // Normalize noise (typical range 0-0.1)
  const crosstalkNorm = Math.min(1, crosstalk / 0.1); // Normalize crosstalk
  const U = Math.max(0, Math.min(1, 0.6 * noiseNorm + 0.4 * crosstalkNorm));

  // Calculate D (Diagnostic) - CHADD formula
  const D = 1 / (1 + Math.exp(-(S - U)));
  const D_clipped = Math.max(0, Math.min(1, D));

  const health = Math.round((1 - D_clipped) * 100);

  // Coherence quality
  const coherenceQuality = coherence;

  // Generate recommendations
  const recommendations: string[] = [];
  if (fidelity < fidelityThreshold) {
    recommendations.push(
      `Low gate fidelity detected (${(fidelity * 100).toFixed(2)}%) - below threshold of ${(fidelityThreshold * 100).toFixed(0)}%`
    );
  }
  if (t1 && t1 < t1Nominal * 0.8) {
    recommendations.push(
      `T1 coherence time below nominal (${t1.toFixed(1)} μs vs ${t1Nominal.toFixed(1)} μs) - check qubit environment`
    );
  }
  if (t2 && t2 < t2Nominal * 0.8) {
    recommendations.push(
      `T2 coherence time below nominal (${t2.toFixed(1)} μs vs ${t2Nominal.toFixed(1)} μs) - check dephasing sources`
    );
  }
  if (noise > 0.05) {
    recommendations.push(`Elevated noise level (${(noise * 100).toFixed(2)}%) - investigate noise sources`);
  }
  if (crosstalk > 0.05) {
    recommendations.push(
      `Elevated crosstalk (${(crosstalk * 100).toFixed(2)}%) - check qubit isolation`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push('All quantum parameters within normal operating ranges');
  }

  return {
    asset_id: request.asset_id,
    assessment_id: `demo-${Date.now()}`,
    squd_score: { S, Q, U, D: D_clipped },
    health,
    coherence_quality: coherenceQuality,
    gate_fidelity_avg: fidelity,
    noise_level: noiseNorm,
    assessed_at: new Date().toISOString(),
    recommendations,
    qubit_metrics: {
      fidelity_mean: fidelity,
      fidelity_min: fidelity * 0.98,
      fidelity_std: 0.01,
      t1_mean: t1,
      t2_mean: t2,
      noise_mean: noise,
      crosstalk_mean: crosstalk,
    },
  };
}

/**
 * Generate demo randomized benchmarking result
 */
function generateDemoRB(
  assetId: string,
  request: RandomizedBenchmarkingRequest
): RandomizedBenchmarkingResponse {
  const gateSequenceLength = request.gate_sequence_length || 10;
  const nSequences = request.n_sequences || 100;
  const depolarizingNoise = request.depolarizing_noise || 0.01;

  const averageFidelity = Math.max(0, 1.0 - depolarizingNoise);
  const fidelityDecayRate = depolarizingNoise / gateSequenceLength;
  const errorRate = depolarizingNoise;

  return {
    asset_id: assetId,
    rb_id: `rb-demo-${Date.now()}`,
    average_fidelity: averageFidelity,
    fidelity_decay_rate: fidelityDecayRate,
    error_rate: errorRate,
    sequences_tested: nSequences,
    assessed_at: new Date().toISOString(),
  };
}

/**
 * Generate demo time series data
 */
function generateDemoTimeSeries(): QuantumTimeSeriesData[] {
  const data: QuantumTimeSeriesData[] = [];
  const baseTime = new Date('2025-01-01T10:00:00Z');
  const n = 100;

  // Demo parameters
  const t1True = 100.0;
  const t2True = 80.0;
  const fidelityBase = 0.96;

  for (let i = 0; i < n; i++) {
    const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals

    // Simulate realistic quantum variations
    const t = i / 20;
    const fidelity = fidelityBase + Math.sin(t) * 0.02 + (Math.random() - 0.5) * 0.01;
    const t1 = t1True + Math.sin(t * 0.5) * 5 + (Math.random() - 0.5) * 2;
    const t2 = t2True + Math.sin(t * 0.5) * 4 + (Math.random() - 0.5) * 1.5;
    const noise = 0.01 + Math.abs(Math.sin(t * 2)) * 0.005 + Math.random() * 0.002;
    const crosstalk = 0.02 + Math.abs(Math.sin(t * 1.5)) * 0.01 + Math.random() * 0.005;

    // Calculate S/Q/U/D (simplified)
    const t1Norm = Math.max(0, Math.min(1, (t1 - 10) / 990));
    const t2Norm = Math.max(0, Math.min(1, (t2 - 5) / 495));
    const coherence = (t1Norm + t2Norm) / 2;
    const S = Math.max(0, Math.min(1, 0.4 * coherence + 0.4 * fidelity + 0.2 * fidelity));

    const fidVar = 1.0 - fidelity;
    const Q = Math.max(0, Math.min(1, 0.7 * fidVar + 0.3 * (1.0 - fidelity)));

    const noiseNorm = Math.min(1, noise / 0.1);
    const crosstalkNorm = Math.min(1, crosstalk / 0.1);
    const U = Math.max(0, Math.min(1, 0.6 * noiseNorm + 0.4 * crosstalkNorm));

    const D = 1 / (1 + Math.exp(-(S - U)));
    const D_clipped = Math.max(0, Math.min(1, D));

    const lowFidelity = fidelity < 0.95 ? 1 : 0;

    data.push({
      timestamp: time.toISOString(),
      fidelity: Math.max(0, Math.min(1, fidelity)),
      t1: Math.max(0, t1),
      t2: Math.max(0, t2),
      noise: Math.max(0, noise),
      crosstalk: Math.max(0, Math.min(1, crosstalk)),
      S,
      Q,
      U,
      D: D_clipped,
      low_fidelity: lowFidelity,
    });
  }

  return data;
}

