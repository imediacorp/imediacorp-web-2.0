/**
 * Business Domain Type Definitions
 */

import { SQUDScore, HealthMetrics } from './api';

// ============================================================================
// Business Types
// ============================================================================

export interface BusinessKPIs {
  revenue_growth: number; // 0-1 or 0-10
  gross_margin: number; // 0-1
  net_revenue_retention: number; // 0-2
  churn_rate: number; // 0-1
  cac_payback_months: number;
  ltv_cac: number;
  nps: number; // -100 to 100
  burn_multiple: number;
  cash_runway_months: number;
  arpu: number;
  sales_cycle_days: number;
  pipeline_coverage: number;
  employee_satisfaction?: number; // 0-1
  employee_retention?: number; // 0-1
  leadership_retention?: number; // 0-1
  rotation_rate?: number; // 0-1
}

export interface BusinessConfig {
  industry?: string;
  stage?: 'startup' | 'growth' | 'mature';
  target_ltv_cac?: number;
  target_churn?: number;
  [key: string]: unknown;
}

export interface BusinessAssessmentRequest {
  company_id: string;
  kpis: BusinessKPIs;
  config?: BusinessConfig;
}

export interface BusinessAssessmentResponse extends HealthMetrics {
  company_id: string;
  assessment_id: string;
  financial_health?: number; // 0-1
  operational_health?: number; // 0-1
  growth_health?: number; // 0-1
  risk_tier?: 'low' | 'medium' | 'high' | 'critical';
  component_health?: {
    revenue?: number;
    profitability?: number;
    retention?: number;
    efficiency?: number;
    cash_management?: number;
  };
  business_metrics?: {
    growth_score?: number;
    efficiency_score?: number;
    sustainability_score?: number;
    market_position?: string;
  };
  recommendations?: string[];
}

export interface BusinessTimeSeriesData {
  timestamp: string;
  revenue_growth: number;
  gross_margin: number;
  churn_rate: number;
  ltv_cac: number;
  cash_runway_months: number;
  S: number;
  Q: number;
  U: number;
  D: number;
}

export interface BusinessMetrics {
  company_id: string;
  metrics: BusinessKPIs[];
  squd_time_series: Array<{
    timestamp: string;
    squd: SQUDScore;
  }>;
}

