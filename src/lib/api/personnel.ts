/**
 * Personnel Health API Client
 */

import type {
  PersonnelAssessmentRequest,
  PersonnelAssessmentResponse,
  CompanyAggregateRequest,
  CompanyAggregateResponse,
  PersonnelProfile,
} from '@/types/personnel';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Personnel API methods
 */
export const personnelApi = {
  /**
   * Assess individual personnel profile
   */
  async assessProfile(request: PersonnelAssessmentRequest): Promise<PersonnelAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/personnel/assess`, {
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
      console.warn('Personnel API not available, using demo data:', err);
      return generateDemoAssessment(request);
    }
  },

  /**
   * Assess company aggregate
   */
  async assessCompany(request: CompanyAggregateRequest): Promise<CompanyAggregateResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/personnel/assess-company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        // Fallback to demo data if API not available
        return generateDemoCompanyAssessment(request);
      }

      return response.json();
    } catch (err) {
      // Fallback to demo data if API not available
      console.warn('Personnel API not available, using demo data:', err);
      return generateDemoCompanyAssessment(request);
    }
  },

  /**
   * Apply stress scenario to profile
   */
  async applyStress(
    profile: PersonnelProfile,
    scenario: string,
    intensity: number
  ): Promise<PersonnelAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/personnel/stress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          scenario,
          intensity,
        }),
      });

      if (!response.ok) {
        return generateStressAssessment(profile, scenario, intensity);
      }

      return response.json();
    } catch (err) {
      console.warn('Personnel stress API not available, using demo data:', err);
      return generateStressAssessment(profile, scenario, intensity);
    }
  },
};

/**
 * Calculate Ma'at balance score
 */
function maatBalanceScore(metrics: Record<string, number>): number {
  const values = Object.values(metrics);
  if (values.length === 0) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  // Balance favors evenness (lower variance) and higher mean
  const balance = 1.0 - Math.tanh(variance * 3.0); // Penalize high variance
  return Math.max(0, Math.min(1, 0.5 * mean + 0.5 * balance));
}

/**
 * Map metrics to CHADD S/Q/U
 */
function mapToSQU(metrics: Record<string, number>): { S: number; Q: number; U: number } {
  const S = 0.5 * (metrics.reliability || 0) + 0.5 * (metrics.integrity || 0);
  const Q = 0.5 * (metrics.collaboration || 0) + 0.5 * (metrics.learning || 0);
  const U = Math.max(0, Math.min(1, 1.0 - (0.5 * (metrics.well_being || 0) + 0.5 * (metrics.performance || 0))));
  
  return { S, Q, U };
}

/**
 * Calculate CHADD diagnostic D
 */
function calculateD(S: number, Q: number, U: number): number {
  return 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
}

/**
 * Generate demo assessment
 */
function generateDemoAssessment(
  request: PersonnelAssessmentRequest
): PersonnelAssessmentResponse {
  const { profile } = request;
  const metrics = profile.metrics;

  const balance = maatBalanceScore(metrics);
  const squ = mapToSQU(metrics);
  const D = calculateD(squ.S, squ.Q, squ.U);
  const health = Math.round((1 - D) * 100);

  // Determine risk tier based on balance and metrics
  const riskScore = (1 - balance) * 0.5 + (1 - Math.min(...Object.values(metrics))) * 0.5;
  const riskTier =
    riskScore > 0.7
      ? 'critical'
      : riskScore > 0.5
        ? 'high'
        : riskScore > 0.3
          ? 'medium'
          : 'low';

  const recommendations: string[] = [];
  if (metrics.performance < 0.5) {
    recommendations.push('Low performance detected - consider training and development programs');
  }
  if (metrics.well_being < 0.5) {
    recommendations.push('Well-being concerns - review work-life balance and support programs');
  }
  if (metrics.collaboration < 0.5) {
    recommendations.push('Collaboration issues - team building and communication improvements needed');
  }
  if (balance < 0.5) {
    recommendations.push('Imbalanced metrics - targeted interventions recommended');
  }
  if (recommendations.length === 0) {
    recommendations.push('All metrics within healthy ranges - continue monitoring');
  }

  return {
    squd_score: { S: squ.S, Q: squ.Q, U: squ.U, D },
    health,
    profile_name: profile.name,
    employee_id: profile.employee_id,
    assessment_id: `pers-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    balance_score: balance,
    risk_tier: riskTier,
    component_health: {
      performance: metrics.performance * 100,
      reliability: metrics.reliability * 100,
      collaboration: metrics.collaboration * 100,
      learning: metrics.learning * 100,
      well_being: metrics.well_being * 100,
      integrity: metrics.integrity * 100,
    },
    squ_mapping: squ,
    recommendations,
  };
}

/**
 * Generate demo company assessment
 */
function generateDemoCompanyAssessment(
  request: CompanyAggregateRequest
): CompanyAggregateResponse {
  const { profiles } = request;

  if (profiles.length === 0) {
    throw new Error('No profiles provided');
  }

  // Aggregate metrics (weighted by FTE weight)
  const totalWeight = profiles.reduce(
    (sum, p) => sum + (p.weight || 1.0),
    0
  );

  const aggregateMetrics: Record<string, number> = {
    performance: 0,
    reliability: 0,
    collaboration: 0,
    learning: 0,
    well_being: 0,
    integrity: 0,
  };

  profiles.forEach((profile) => {
    const weight = profile.weight || 1.0;
    Object.keys(aggregateMetrics).forEach((key) => {
      aggregateMetrics[key] +=
        (profile.metrics[key as keyof typeof profile.metrics] || 0) * weight;
    });
  });

  Object.keys(aggregateMetrics).forEach((key) => {
    aggregateMetrics[key] = Math.max(
      0,
      Math.min(1, aggregateMetrics[key] / totalWeight)
    );
  });

  const balance = maatBalanceScore(aggregateMetrics);
  const squ = mapToSQU(aggregateMetrics);
  const D = calculateD(squ.S, squ.Q, squ.U);
  const health = Math.round((1 - D) * 100);

  const riskScore = (1 - balance) * 0.5 + (1 - Math.min(...Object.values(aggregateMetrics))) * 0.5;
  const riskTier =
    riskScore > 0.7
      ? 'critical'
      : riskScore > 0.5
        ? 'high'
        : riskScore > 0.3
          ? 'medium'
          : 'low';

  const recommendations: string[] = [];
  if (aggregateMetrics.performance < 0.6) {
    recommendations.push('Company-wide performance improvement programs needed');
  }
  if (aggregateMetrics.well_being < 0.6) {
    recommendations.push('Organizational well-being initiatives recommended');
  }
  if (balance < 0.5) {
    recommendations.push('Organizational metrics imbalanced - strategic HR interventions needed');
  }
  if (recommendations.length === 0) {
    recommendations.push('Company metrics within healthy ranges - maintain current programs');
  }

  return {
    squd_score: { S: squ.S, Q: squ.Q, U: squ.U, D },
    health,
    assessment_id: `company-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    headcount: profiles.length,
    total_weight: totalWeight,
    balance_score: balance,
    squ_mapping: squ,
    aggregate_metrics: aggregateMetrics as any,
    component_health: {
      performance: aggregateMetrics.performance * 100,
      reliability: aggregateMetrics.reliability * 100,
      collaboration: aggregateMetrics.collaboration * 100,
      learning: aggregateMetrics.learning * 100,
      well_being: aggregateMetrics.well_being * 100,
      integrity: aggregateMetrics.integrity * 100,
    },
    risk_tier: riskTier,
    recommendations,
  };
}

/**
 * Generate stress assessment
 */
function generateStressAssessment(
  profile: PersonnelProfile,
  scenario: string,
  intensity: number
): PersonnelAssessmentResponse {
  // Apply stress scenario deltas
  const stressDeltas: Record<string, Record<string, number>> = {
    'Workload Spike': {
      performance: -0.15,
      well_being: -0.2,
      reliability: -0.1,
    },
    'Social Conflict': {
      collaboration: -0.25,
      well_being: -0.15,
      performance: -0.05,
    },
    'Managerial Turnover': {
      reliability: -0.2,
      learning: -0.1,
      collaboration: -0.1,
    },
    'Fatigue/Health Shock': {
      well_being: -0.3,
      performance: -0.1,
      learning: -0.05,
    },
    'Integrity Incident': {
      integrity: -0.35,
      collaboration: -0.1,
      reliability: -0.1,
    },
  };

  const deltas = stressDeltas[scenario] || {};
  const stressedMetrics = { ...profile.metrics };

  Object.keys(deltas).forEach((key) => {
    stressedMetrics[key as keyof typeof stressedMetrics] = Math.max(
      0,
      Math.min(
        1,
        (stressedMetrics[key as keyof typeof stressedMetrics] || 0) +
          deltas[key] * intensity
      )
    );
  });

  const balance = maatBalanceScore(stressedMetrics);
  const squ = mapToSQU(stressedMetrics);
  const D = calculateD(squ.S, squ.Q, squ.U);
  const health = Math.round((1 - D) * 100);

  const riskScore = (1 - balance) * 0.5 + (1 - Math.min(...Object.values(stressedMetrics))) * 0.5;
  const riskTier =
    riskScore > 0.7
      ? 'critical'
      : riskScore > 0.5
        ? 'high'
        : riskScore > 0.3
          ? 'medium'
          : 'low';

  const recommendations: string[] = [
    `Post-stress recovery plan needed for ${scenario}`,
    'Monitor affected metrics closely',
    'Implement targeted support interventions',
  ];

  return {
    squd_score: { S: squ.S, Q: squ.Q, U: squ.U, D },
    health,
    profile_name: profile.name,
    employee_id: profile.employee_id,
    assessment_id: `stress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    balance_score: balance,
    risk_tier: riskTier,
    component_health: {
      performance: stressedMetrics.performance * 100,
      reliability: stressedMetrics.reliability * 100,
      collaboration: stressedMetrics.collaboration * 100,
      learning: stressedMetrics.learning * 100,
      well_being: stressedMetrics.well_being * 100,
      integrity: stressedMetrics.integrity * 100,
    },
    squ_mapping: squ,
    recommendations,
  };
}


